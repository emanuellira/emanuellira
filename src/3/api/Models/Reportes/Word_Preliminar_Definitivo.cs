using api.Models.Api_Paths;
using DataAccess;
using PDFSharpFlow;
using PDFSharpFlow.PDFFlowable_Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Reportes
{
  public class Word_Preliminar_Definitivo
  {
    #region [Propiedades]
    private readonly Reporte reporte;
    private readonly string tipo;
    private readonly Eventos evento;
    private readonly List<Diagnosticos_Pre> diags;
    private Paths paths;
    private OfficeFlowable word;
    public PDFFlowable_Table tabla = new PDFFlowable_Table();
    #endregion

    #region [AnonymousFunctions]
    private readonly Func<List<Diagnosticos_Pre>, double> Get_Area = (diags) => diags.Sum(s => (int)s.Unidades);
    private readonly Func<List<Diagnosticos_Pre>, double> Get_PobAfectada = (diags) => diags.Sum(s => s.PoblacionAfectada);
    private readonly Func<List<Diagnosticos_Pre>, double> Get_CostoTotal = (diags) => diags.Sum(s => s.CostoTotalR);
    #endregion
    public Word_Preliminar_Definitivo(string _tipo_, Reporte _reporte_, Eventos _evento_, List<Diagnosticos_Pre> _diags_)
    {
      reporte = _reporte_;
      tipo = _tipo_;
      diags = _diags_;
      evento = _evento_;
    }

    public string Create()
    {
      //Obtener rutas y Nombre del archivo
      paths = new Paths(reporte);
      string nuevo_nombre = $"{tipo}_{paths.GUID}";
      string save_path = $"{paths.Fisical_Path}\\reportespdf\\{nuevo_nombre}.doc";

      word = new OfficeFlowable(save_path, paths.Url_Path, nuevo_nombre);
      List<string> textos = paths.Data.Data_Parse_List_String("textos");
      /*** Títulos ***/
      Set_Titulos();

      List<Deptos> _diags_ = Get_Departamentos(diags);
      /*** Primer Texto ***/
      Set_Texto_1(textos, _diags_);
      word.LineBreak();
      /*** Segundo Texto ***/
      Set_Texto_2(textos, _diags_);
      word.LineBreak(3);
      /*** Tabla: Resumen por departamentos, Familias, Área dañada y Estimación de pérdida ***/
      Set_Tabla(textos);
      word.LineBreak();
      /*** Tabla: Resumen por municipios, Familias, Área dañada y Estimación de pérdida ***/
      List<Deptos> _mpios_ =Get_Municipios(diags);
      Set_Tabla_Municipios(textos, _mpios_);
      /*** Cabecera ***/
      PDFFlowable_Header header = new PDFFlowable_Header
      {
        Textos = textos.ElementAt(0).Data_Parse("texto").Split('|').ToList(),
        WithImage = (true, $"{paths.Fisical_Path}/images/Logo/Sectores/maga_web.png")
      };

      word.Add = header;
      /*** Firmas ***/
      PDFFlowable_Firmas firmas = new PDFFlowable_Firmas(reporte.Firmas.ToList(), "#8EA9DB");
      word.Add = firmas;
      /*** Finalizar documento ***/
      word.Close();

      return $"{paths.Url_Path}/ReportesPDF/{nuevo_nombre}.doc";
    }

    #region [Function] Name-> Set_Tabla_Municipios
    private void Set_Tabla_Municipios(List<string> textos, List<Deptos> _mpios_)
    {
      //Agregar cabeceras
      PDFFlowable_Table tabla_mpios = new PDFFlowable_Table();
      string str_headers = textos.ElementAt(5).Data_Parse("texto");
      string[] headers = str_headers.Split('|');
      List<PDFFlowable_Cell> fila = new List<PDFFlowable_Cell>();
      foreach (string h in headers)
      {
        fila.Add(new PDFFlowable_Cell() { Value = h, Bold = true, Color = "#D9E1F2", Borders = (-1, -1, 2, -1, "#8EA9DB") });
      }
      tabla_mpios.Filas.Add(fila);

      double total_area = 0;
      double total_familia = 0;
      double total_total = 0;

      foreach (Deptos d in _mpios_)
      {
        double area = Get_Area(d.Diags);
        total_area += area;
        double familias = Get_PobAfectada(d.Diags);
        total_familia += familias;
        double total = Get_CostoTotal(d.Diags);
        total_total += total;
        fila = new List<PDFFlowable_Cell>
        {
          new PDFFlowable_Cell() { Value = d.Keys, Borders= (-1,-1,-1,-1,"#ffffff") },
          new PDFFlowable_Cell() { Value =  familias.ToString("N", paths.Formato), Style_Apply="Normal_Right", Borders= (-1,-1,-1,-1,"#ffffff") },
          new PDFFlowable_Cell() { Value = area.ToString("N", paths.Formato), Style_Apply="Normal_Right", Borders= (-1,-1,-1,-1,"#ffffff") },
          new PDFFlowable_Cell() { Value = total.ToString("N", paths.Formato), Style_Apply="Normal_Right", Borders= (-1,-1,-1,-1,"#ffffff") }
        };
        tabla_mpios.Filas.Add(fila);
      }

      fila = new List<PDFFlowable_Cell>
        {
          new PDFFlowable_Cell() { Value = "Total", Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") },
          new PDFFlowable_Cell() { Value =  total_familia.ToString("N", paths.Formato), Style_Apply="Normal_Right", Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") },
          new PDFFlowable_Cell() { Value = total_area.ToString("N", paths.Formato), Style_Apply="Normal_Right", Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") },
          new PDFFlowable_Cell() { Value = total_total.ToString("N", paths.Formato), Style_Apply="Normal_Right", Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") }
        };
      tabla_mpios.Filas.Add(fila);

      string titulo = textos.ElementAt(5).Data_Parse("titulo");
      word.Style_Apply = null;
      word.Add = titulo;
      word.Add = tabla_mpios;
    }
    #endregion

    #region [Function] Name-> Set_Tabla
    /// <summary>
    /// Prepara los datos de la tabla, aunque las filas se generan en @link {Set_Texto_2}
    /// </summary>
    /// <param name="textos"></param>
    private void Set_Tabla(List<string> textos)
    {
      string titulo = textos.ElementAt(4).Data_Parse("titulo");
      word.Style_Apply = "Normal";
      word.Add = titulo;
      word.Add = tabla;
    }
    #endregion

    #region [Function] Name-> Set_Texto_2
    /// <summary>
    /// Coloca los textos por departamento y su resumen
    /// </summary>
    /// <param name="textos"></param>
    /// <param name="_diags_"></param>
    private void Set_Texto_2(List<string> textos, List<Deptos> _diags_)
    {
      string titulo_deptos = textos.ElementAt(3).Data_Parse("titulo");
      string texto_deptos = textos.ElementAt(3).Data_Parse("texto");
      //Agregar cabeceras
      string str_headers = textos.ElementAt(4).Data_Parse("texto");
      string[] headers = str_headers.Split('|');
      List<PDFFlowable_Cell> fila = new List<PDFFlowable_Cell>();
      foreach (string h in headers)
      {
        fila.Add(new PDFFlowable_Cell() { Value = h, Bold = true, Color = "#D9E1F2", Borders = (-1, -1, 2, -1, "#8EA9DB") });
      }
      tabla.Filas.Add(fila);

      double total_area = 0;
      double total_familia = 0;
      double total_total = 0;
      foreach (Deptos d in _diags_)
      {
        word.Style_Apply = "Normal_Left";
        word.Add = titulo_deptos.Replace("__depto__", d.Keys);

        string infra_da = Get_InfraDa(d.Diags);
        List<Deptos> mpios = Get_Municipios(d.Diags);
        List<string> _mpios_ = new List<string>();
        foreach (Deptos m in mpios)
        {
          _mpios_.Add(m.Keys);
        }
        double area = Get_Area(d.Diags);
        total_area += area;
        double familias = Get_PobAfectada(d.Diags);
        total_familia += familias;
        double total = Get_CostoTotal(d.Diags);
        total_total += total;
        fila = new List<PDFFlowable_Cell>
        {
          new PDFFlowable_Cell() { Value = d.Keys, Borders= (-1,-1,-1,-1,"#ffffff") },
          new PDFFlowable_Cell() { Value =  familias.ToString("N", paths.Formato), Style_Apply="Normal_Right", Borders= (-1,-1,-1,-1,"#ffffff") },
          new PDFFlowable_Cell() { Value = area.ToString("N", paths.Formato), Style_Apply="Normal_Right", Borders= (-1,-1,-1,-1,"#ffffff") },
          new PDFFlowable_Cell() { Value = total.ToString("N", paths.Formato), Style_Apply="Normal_Right", Borders= (-1,-1,-1,-1,"#ffffff") }
        };
        tabla.Filas.Add(fila);
        string texto = texto_deptos
          .Replace("__losses__", infra_da)
          .Replace("__mpios__", String.Join(" ,", _mpios_))
          .Replace("__area__", area.ToString("N", paths.Formato))
          .Replace("__familias__", familias.ToString("N", paths.Formato))
          .Replace("__montototal__", total.ToString("N", paths.Formato));

        word.Style_Apply = "Normal";
        word.Add = texto;
        word.LineBreak();
      }

      fila = new List<PDFFlowable_Cell>
        {
          new PDFFlowable_Cell() { Value = "Total", Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") },
          new PDFFlowable_Cell() { Value =  total_familia.ToString("N", paths.Formato), Style_Apply="Normal_Right", Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") },
          new PDFFlowable_Cell() { Value = total_area.ToString("N", paths.Formato), Style_Apply="Normal_Right",Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") },
          new PDFFlowable_Cell() { Value = total_total.ToString("N", paths.Formato), Style_Apply="Normal_Right",Color = "#D9E1F2", Borders= (2,-1,-1,-1,"#8EA9DB") }
        };
      tabla.Filas.Add(fila);
    }
    #endregion

    #region [Function] Name-> Set_Texto_1
    /// <summary>
    /// Coloca el primer texto que representa el resumen general por departamento
    /// </summary>
    /// <param name="textos"></param>
    /// <param name="_diags_"></param>
    private void Set_Texto_1(List<string> textos, List<Deptos> _diags_)
    {
      List<string> _deptos_ = new List<string>();
      foreach (Deptos d in _diags_)
      {
        _deptos_.Add(d.Keys);
      }
      // Obtiene los departamentos en string separados por comas
      string div_terr = string.Join(", ", _deptos_);
      string infra_da = Get_InfraDa(diags);
      string texto = textos.ElementAt(2).Data_Parse("texto")
          .Replace("__deptos__", div_terr)
          .Replace("__losses__", infra_da)
          .Replace("__area__", Get_Area(diags).ToString("N", paths.Formato))
          .Replace("__familias__", Get_PobAfectada(diags).ToString("N", paths.Formato))
          .Replace("__montototal__", Get_CostoTotal(diags).ToString("N", paths.Formato));
      word.Style_Apply = "Normal";
      word.Add = texto;
    }
    #endregion

    #region [Function] Name-> Set_Titulos
    /// <summary>
    /// Colo el nombre del documento,  el evento y la fecha
    /// </summary>
    private void Set_Titulos()
    {
      // datos del json
      string titulo1 = paths.Data.Data_Parse("titulo1").Replace("__predef__", tipo);
      string titulo2 = paths.Data.Data_Parse("titulo2").Replace("__evento__", $"{evento.Fenomeno} {evento.Nombre}");
      string titulo3 = paths.Data.Data_Parse("titulo3").Replace("__today__", DateTime.Now.ToLongDateString());

      word.Style_Apply = "Heading1";
      word.Add = titulo1.ToUpper(); //titulo1 del json
      word.Style_Apply = "Heading2";
      word.Add = titulo2.ToUpper();
      word.Style_Apply = "Heading3";
      word.Add = titulo3;
    }
    #endregion

    #region [Function] Name-> Get_Municipios
    /// <summary>
    /// Obtiene los municipios afectados
    /// </summary>
    /// <param name="diags"></param>
    /// <returns></returns>
    private List<Deptos> Get_Municipios(List<Diagnosticos_Pre> diags)
    {
      var grupos = diags.GroupBy(g => g.DIVADMIN3).ToList();
      //Utilizado para los municipios
      List<Deptos> resultado = new List<Deptos>();
      foreach (var s in grupos)
      {
        if (s.Key != null)
        {
          List<Diagnosticos_Pre> _diags_ = new List<Diagnosticos_Pre>();
          foreach (var d in s)
          {
            _diags_.Add(d);
          }
          resultado.Add(new Deptos() { Keys = s.Key.ToString(), Diags = _diags_ });
        }
      }

      return resultado;
    }
    #endregion

    #region [Function] Name-> Get_Departamentos
    /// <summary>
    /// Obtiene los departamentos afectados y agrupa la información por departamento
    /// </summary>
    /// <param name="diags"></param>
    /// <returns></returns>
    private List<Deptos> Get_Departamentos(List<Diagnosticos_Pre> diags)
    {
      var grupos = diags.GroupBy(g => g.DIVADMIN2).ToList();

      List<Deptos> resultado = new List<Deptos>();
      foreach (var s in grupos)
      {
        if (s.Key != null)
        {
          List<Diagnosticos_Pre> _diags_ = new List<Diagnosticos_Pre>();
          foreach (var d in s)
          {
            _diags_.Add(d);
          }
          resultado.Add(new Deptos() { Keys = s.Key.ToString(), Diags = _diags_ });
        }
      }

      return resultado;
    }
    #endregion

    #region [Function] Name-> Get_InfraDa
    /// <summary>
    /// Obtiene la información del bien dañado
    /// </summary>
    /// <param name="diags"></param>
    /// <returns></returns>
    private string Get_InfraDa(List<Diagnosticos_Pre> diags)
    {
      var grupos = diags.GroupBy(g => g.InfraDa).ToList();
      List<string> resultado = new List<string>();
      foreach (var s in grupos)
      {
        if (s.Key != null)
          resultado.Add(s.Key.ToString());
      }

      return string.Join(", ", resultado);
    }
    #endregion
  }
}
