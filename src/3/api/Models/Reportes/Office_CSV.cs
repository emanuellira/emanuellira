using api.Models.Api_Paths;
using DataAccess;
using PDFSharpFlow;
using PDFSharpFlow.PDFFlowable_Classes;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Web;

namespace api.Models.Reportes
{
  public class Office_CSV
  {
    #region [Propiedades]
    private readonly Reporte reporte;
    private readonly string tipo;
    private readonly List<Diagnosticos_Pre> diags;
    private Paths paths;
    #endregion
    public Office_CSV(string _tipo_, Reporte _reporte_, List<Diagnosticos_Pre> _diags_)
    {
      reporte = _reporte_;
      tipo = _tipo_;
      diags = _diags_;
    }

    public string Create()
    {
      //Obtener rutas y Nombre del archivo
      paths = new Paths(reporte);
      string nuevo_nombre = $"{tipo}_{paths.GUID}";
      string save_path = $"{paths.Fisical_Path}\\reportespdf\\{nuevo_nombre}.csv";

      StringBuilder b = new StringBuilder();
      List<string> textos = paths.Data.Data_Parse_List_String("excell");
      List<string> row = new List<string>();
      List<(string, string, string, string)> headers = new List<(string, string, string, string)>();
      //List<string> formats = new List<string>();
      foreach (string t in textos)
      {
        headers.Add(
            (
              t.Data_Parse("campo"),
              t.Data_Parse("replace"),
              t.Data_Parse("value"),
              t.Data_Parse("tipo")
            )
          );
        //formats.Add(t.Data_Parse("format"));
        string[] aliases = t.Data_Parse("alias").Split('|');
        foreach (string alias in aliases)
        {
          row.Add($"\"{alias}\"");
        }
      }
      b.AppendLine(String.Join(",", row.ToArray()));
      bool agregado = false;
      foreach (Diagnosticos_Pre d in diags)
      {
        row = new List<string>();
        foreach ((string header, string replace, string value, string tipo_control) in headers)
        {
          List<string> lst_replace = replace != null ? replace.Split('|').ToList() : new List<string>();

          foreach (PropertyInfo pro in d.GetType().GetProperties())
          {
            if (pro.Name == header)
            {
              string valor = pro.GetValue(d).ToString();
              if (valor == null)
                row.Add("");
              else
              {
                if (tipo_control != null && tipo_control == "stepper")
                {
                  string[] vs = valor.Split('|');
                  foreach (string v in vs)
                  {
                    row.Add($"\"{v}\"");
                  }

                }
                else
                {
                  string v = valor;
                  foreach (string rs in lst_replace)
                  {
                    string[] r = rs.Split(':', (char)StringSplitOptions.RemoveEmptyEntries);
                    v = v.Replace(r[0], r[1]);
                  }
                  row.Add($"\"{v}\"");
                }
              }

              agregado = true;
              break;
            }
          }
          if (!agregado)
          {
            if (value == null)
              row.Add("");
            else
              row.Add($"\"{value}\"");
          }
        }
        b.AppendLine(String.Join(",", row.ToArray()));
      }
      File.WriteAllText(save_path, b.ToString(), Encoding.UTF8);

      return $"{paths.Url_Path}/ReportesPDF/{nuevo_nombre}.csv";
    }
  }
}
