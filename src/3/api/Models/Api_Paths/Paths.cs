using api.Models.Reportes;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Text.RegularExpressions;
using DataAccess;
using System.Globalization;
using System.Reflection;

namespace api.Models.Api_Paths
{
  public class Paths
  {
    public string Url_Path { get; }
    public string Fisical_Path { get; }
    public string Data { get; }
    public string GUID { get; }
    public NumberFormatInfo Formato { get; private set; }

    public Paths(Reporte reporte)
    {
      Fisical_Path = AppDomain.CurrentDomain.BaseDirectory.ToLower();
      Fisical_Path = reporte.Debug ? Fisical_Path.Replace("3\\api", "assets") : Fisical_Path.Replace("api", "assets");
      string ssl = reporte.SSL ? "s" : "";
      Url_Path = $"http{ssl}://{reporte.Url}/assets";

      Guid guid = Guid.NewGuid();
      GUID = $"{ DateTime.Now.Day}-{ DateTime.Now.Month}-{ DateTime.Now.Year}_{ guid.ToString().Split('-')[4]}";

      if (reporte.IDSector > 0)
      {
        string jsonpath = $"{Url_Path}/config/json/reportes/{reporte.Abr}/{reporte.IDSector}.json";
        WebClient wc = new WebClient
        {
          Encoding = System.Text.Encoding.UTF8
        };
        string str_data = wc.DownloadString(jsonpath);
        JObject r = JObject.Parse(str_data);
        Data = r["reporte"].ToString();
      }
      string[] cultures = reporte.Culture.Split('|');
      Formato = new CultureInfo(cultures[0]).NumberFormat;
      Formato.CurrencyGroupSeparator = cultures[1];
      Formato.NumberDecimalSeparator = cultures[2];
    }
  }

  public static class Extentions
  {
    public static string Data_Parse(this string _this, string keys)
    {
      string[] Keys = keys.Split('.');
      int count = Keys.Length;
      string r = _this;
      for (int i = 0; i < count; i++)
      {
        JObject o = JObject.Parse(r);
        r = o[Keys[i]]?.ToString();
        if (r == null) { return r; }
      }

      return r;
    }

    public static List<string> Data_Parse_List_String(this string _this, string keys)
    {
      string[] Keys = keys.Split('.');
      int count = Keys.Length;
      string r = _this;
      for (int i = 0; i < count - 1; i++)
      {
        JObject o = JObject.Parse(r);
        r = o[Keys[i]].ToString();
      }
      JObject u = JObject.Parse(r);
      List<JToken> array1 = u[Keys[Keys.Length - 1]].Children().ToList();
      List<string> array = new List<string>();
      foreach (JToken a in array1)
      {
        array.Add(a.ToString());
      }
      return array;
    }

    public static List<Diagnosticos_Pre> To_DiagnosticosPre(this List<Diagnosticos_Def> _this)
    {
      List<Diagnosticos_Pre> diagnosticos_pre = new List<Diagnosticos_Pre>();

      foreach (Diagnosticos_Def d in _this)
      {
        diagnosticos_pre.Add(new Diagnosticos_Pre()
        {
          IDActivo = d.IDActivo,
          IDAccion = d.IDAccion,
          IDUsuario = d.IDUsuario,
          IDDIVADMIN1 = d.IDDIVADMIN1,
          DIVADMIN1 = d.DIVADMIN1,
          IDDIVADMIN3 = d.IDDIVADMIN3,
          DIVADMIN3 = d.DIVADMIN3,
          IDDIVADMIN2 = d.IDDIVADMIN2,
          DIVADMIN2 = d.DIVADMIN2,
          Reunion = d.Reunion,
          Domicilio = d.Domicilio,
          Longitud = d.Longitud,
          Latitud = d.Latitud,
          Foto1 = d.Foto1,
          Foto2 = d.Foto2,
          Foto3 = d.Foto3,
          Foto4 = d.Foto4,
          IDSector = d.IDSector,
          CPS = d.CPS,
          EstatusAseguramiento = d.EstatusAseguramiento,
          ApoyosAnteriores = d.ApoyosAnteriores,
          PoblacionAfectada = d.PoblacionAfectada,
          UnidadMedida = d.UnidadMedida,
          ZonaAfectada = d.ZonaAfectada,
          TipoZonaAfectada = d.TipoZonaAfectada,
          InmuebleDaniado = d.InmuebleDaniado,
          Responsable = d.Responsable,
          Titular = d.Titular,
          Cargo = d.Cargo,
          IDEvento = d.IDEvento,
          FechaCreacion = d.FechaCreacion,
          FechaModificacion = d.FechaModificacion,
          Diagnostico = d.Diagnostico,
          Restauracion = d.Restauracion,
          TipoDanio = d.TipoDanio,
          CostoUnitario = d.CostoUnitario,
          CostoTotalObra = d.CostoTotalObra,
          Estatus = d.Estatus,
          CES1 = d.CES1,
          CES2 = d.CES2,
          InfraDa = d.InfraDa,
          Observaciones = d.Observaciones,
          Material = d.Material,
          Clave = d.Clave,
          NomSector = d.NomSector,
          AbrevMin = d.AbrevMin,
          Ministerio = d.Ministerio,
          CostoAdmin = d.CostoAdmin,
          CostoTotalR = d.CostoTotalR,
          Fenomeno = d.Fenomeno,
          FechaExpira = d.FechaExpira,
          FContactoTel = d.FContactoTel,
          FContactoMail = d.FContactoMail,
          CES1Activo = d.CES1Activo,
          CES2Activo = d.CES2Activo,
          FechaSiembra = d.FechaSiembra,
          Localidad = d.Localidad,
          TipoAdmin = d.TipoAdmin,
          Nivel = d.Nivel,
          AreaTerreno = d.AreaTerreno,
          AguaPotable = d.AguaPotable,
          Drenaje = d.Drenaje,
          Energia = d.Energia,
          FechaCaptura = d.FechaCaptura,
          AccesoInm = d.AccesoInm,
          AreaConstruccion = d.AreaConstruccion,
          DrenajePluvial = d.DrenajePluvial,
          TrenAseo = d.TrenAseo,
          Unidades = d.Unidades
        });
      }

      return diagnosticos_pre;
    }
  }
}
