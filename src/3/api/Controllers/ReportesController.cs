using api.Models.Borrar;
using api.Models.Api_Paths;
using api.Models.Login;
using api.Models.Reportes;
using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using api.Models.Data;

namespace api.Controllers
{
  /// <summary>
  /// 
  /// 
  /// Genera los reportes
  /// [# version: 3.7.11 #]
  /// </summary>
  public class ReportesController : ApiController
  {
    /// <summary>
    /// Método general para crear un reporte
    /// </summary>
    /// <param name="reporte"></param>
    /// <returns>si es !null, significa la liga de descarga</returns>
    public HttpResponseMessage Post([FromBody] Reporte reporte)
    {
      try
      {
        var req = Request;
        var headers = req.Headers;
        var Token = headers.GetValues("Authorization").First();
        string API = headers.GetValues("Sired_api_key").First();

        Usuario _usuario_ = new Usuario();
        if (_usuario_.ExisteToken(Token, API))
        {
          using (SIRED_Entities entity = new SIRED_Entities(_usuario_.API))
          {
            Diag_D response = new Diag_D();
            List<Diagnosticos_Pre> diags_pre;
            List<Diagnosticos_Def> diags_def;
            Eventos evento = entity.Eventos.ToList().Find(f => f.IDEvento == reporte.IDEvento);
            PDF_Preliminar_Definitivo doc;
            Word_Preliminar_Definitivo word;
            Office_CSV doc_csv;

            switch (reporte.Tipo_Doc)
            {
              case "DOC_PRE":
                diags_pre = entity.Diagnosticos_Pre.Where(w => w.IDUsuario == reporte.IDUsuario).ToList();
                doc = new PDF_Preliminar_Definitivo("Preliminar", reporte, evento, diags_pre);

                response.Url = doc.Create();
                break;

              case "DOC_WORD_PRE":
                diags_pre = entity.Diagnosticos_Pre.Where(w => w.IDUsuario == reporte.IDUsuario).ToList();
                word = new Word_Preliminar_Definitivo("Preliminar", reporte, evento, diags_pre);

                response.Url = word.Create();
                break;

              case "DOC_CSV_PRE":
                diags_pre = entity.Diagnosticos_Pre.Where(w => w.IDUsuario == reporte.IDUsuario).ToList();
                doc_csv = new Office_CSV("INFO", reporte, diags_pre);

                response.Url = doc_csv.Create();
                break;
              case "DOC_WORD_DEF":
                diags_def = entity.Diagnosticos_Def.Where(w => w.IDUsuario == reporte.IDUsuario && w.Estatus != "APP").ToList();
                diags_pre = diags_def.To_DiagnosticosPre();
                word = new Word_Preliminar_Definitivo("Definitivo", reporte, evento, diags_pre);

                response.Url = word.Create();
                break;

              case "DOC_CSV_DEF":
                diags_def = entity.Diagnosticos_Def.Where(w => w.IDUsuario == reporte.IDUsuario && w.Estatus != "APP").ToList();
                diags_pre = diags_def.To_DiagnosticosPre();
                doc_csv = new Office_CSV("INFO", reporte, diags_pre);

                response.Url = doc_csv.Create();
                break;
            }

            return Request.CreateResponse(HttpStatusCode.OK, response);
          }

        }
        else
        {
          return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "El token no es correcto");
        }
      }
      catch (Exception err)
      {
        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, err);
      }
    }

    /// <summary>
    /// Método para crear un reporte de acuerdo a un filtro seleccionado
    /// </summary>
    /// <param name="reporte"></param>
    /// <returns></returns>
    [Route("_3/Reportes/Filtro")]
    [HttpPost]
    public HttpResponseMessage Filtro([FromBody] Reporte reporte)
    {
      try
      {
        var req = Request;
        var headers = req.Headers;
        var Token = headers.GetValues("Authorization").First();
        string API = headers.GetValues("Sired_api_key").First();

        Usuario _usuario_ = new Usuario();
        //reporte.Descripcion = "IDEvento|0|IDSector|8";
        if (_usuario_.ExisteToken(Token, API))
        {
          using (SIRED_Entities entity = new SIRED_Entities(_usuario_.API))
          {
            bool isCaptura = reporte.Tipo_Doc == "DOC_WORD_PRE";
            SQL_Query_AND_Commands sql = new SQL_Query_AND_Commands(isCaptura ? "Diagnosticos_Pre" : "Diagnosticos_Def");
            Eventos evento = entity.Eventos.ToList().Find(f => f.IDEvento == reporte.IDEvento);
            PDF_Preliminar_Definitivo doc;
            Word_Preliminar_Definitivo word;
            Office_CSV doc_csv;
            Diag_D response = new Diag_D
            {
              Descripcion = string.Empty
            };
            List<Diagnosticos_Pre> diags_pre = new List<Diagnosticos_Pre>();
            List<Diagnosticos_Def> diags_def = new List<Diagnosticos_Def>();
            if (isCaptura)
            {
              diags_pre = entity
                           .Diagnosticos_Pre.SqlQuery(
                             sql.Create_Where(reporte), sql.Get_Parameters()
                           ).ToList();
            }
            else
            {
              diags_def = entity
                          .Diagnosticos_Def.SqlQuery(
                            sql.Create_Where(reporte), sql.Get_Parameters()
                          ).ToList();
            }
            if (diags_def.Count > 0 || diags_pre.Count > 0)
            {
              switch (reporte.Tipo_Doc)
              {
                case "DOC_PRE":
                  doc = new PDF_Preliminar_Definitivo("Preliminar", reporte, evento, diags_pre);
                  response.Url = doc.Create();
                  break;
                case "DOC_WORD_PRE":
                  word = new Word_Preliminar_Definitivo("Preliminar", reporte, evento, diags_pre);
                  response.Url = word.Create();
                  break;
                case "DOC_CSV_PRE":
                  doc_csv = new Office_CSV("INFO", reporte, diags_pre);
                  response.Url = doc_csv.Create();
                  break;
                case "DOC_WORD_DEF":
                  diags_pre = diags_def.To_DiagnosticosPre();
                  word = new Word_Preliminar_Definitivo("Definitivo", reporte, evento, diags_pre);
                  response.Url = word.Create();
                  break;
                case "DOC_CSV_DEF":
                  diags_pre = diags_def.To_DiagnosticosPre();
                  doc_csv = new Office_CSV("INFO", reporte, diags_pre);
                  response.Url = doc_csv.Create();
                  break;
              }
              return Request.CreateResponse(HttpStatusCode.OK, response);
            }
            else
            {
              response.Descripcion = "No existe información para generar el reporte";
              return Request.CreateResponse(HttpStatusCode.OK, response);
            }
          }
        }
        else
        {
          return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "El token no es correcto");
        }
      }
      catch (Exception err)
      {
        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, err);
      }
    }
  }
}
