using api.Models.Borrar;
using api.Models.Data;
using api.Models.Login;
using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace api.Controllers
{
  /// <summary>
  /// Métodos para trabajar con los eventos
  /// [# version: 3.7.5 #]
  /// </summary>
  public class EventosController : ApiController
  {
    /// <summary>
    /// Obtiene los datos del evento
    /// </summary>
    /// <param name="id">id del evento solicitado</param>
    /// <returns></returns>
    public HttpResponseMessage Get(int id)
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
            Eventos _evento_ = entity.Eventos.ToList()
              .Find(e => e.IDEvento == id);
            Eventos_ ev_ = new Eventos_()
            {
              IDEvento = _evento_.IDEvento,
              Fenomeno = _evento_.Fenomeno,
              Nombre = _evento_.Nombre,
              FechaEvento = _evento_.FechaEvento,
              FechaCreacion = _evento_.FechaCreacion,
              FechaModificacion = _evento_.FechaModificacion,
              Estatus = _evento_.Estatus,
              Eliminado = _evento_.Eliminado,
              Autoriza = _evento_.Autoriza
            };

            return Request.CreateResponse(HttpStatusCode.OK, ev_);
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
    /// Regresa el listado de eventos
    /// </summary>
    /// <returns></returns>
    public HttpResponseMessage Get()
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
            List<Eventos> evs = entity.Eventos.ToList();
            List<Eventos_> evs_ = new List<Eventos_>();
            evs.ForEach((e) => {
              evs_.Add(new Eventos_()
              {
                IDEvento = e.IDEvento,
                Fenomeno= e.Fenomeno,
                Nombre = e.Nombre,
                FechaEvento = e.FechaEvento,
                FechaCreacion = e.FechaCreacion,
                FechaModificacion = e.FechaModificacion,
                Estatus = e.Estatus,
                Eliminado = e.Eliminado,
                Autoriza = e.Autoriza
              });
            });
            return Request.CreateResponse(HttpStatusCode.OK, _usuario_.Tipo == "ADMINISTRADOR" ? evs_ : evs_.Where(w => w.Eliminado == 0));
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
    /// Actualiza la información del evento
    /// </summary>
    /// <param name="evento"></param>
    /// <returns></returns>
    public HttpResponseMessage Post([FromBody] Eventos evento)
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
            Eventos _evento_;
            Diag_D response = new Diag_D();
            if (evento.IDEvento > 0)
            {
              //Actualizar
              List<Eventos> ev = entity.Eventos.ToList();
              _evento_ = ev.Find(w => w.IDEvento == evento.IDEvento);
              _evento_.Fenomeno = evento.Fenomeno;
              _evento_.Nombre = evento.Nombre;
              _evento_.FechaEvento = evento.FechaEvento;
              _evento_.Estatus = evento.Estatus;
              _evento_.Eliminado = evento.Eliminado;
              _evento_.Autoriza = evento.Autoriza;
              _evento_.FechaModificacion = DateTime.Now;

              entity.SaveChanges();

              response.Descripcion = "El evento ha sido actualizado";
            }
            else
            {
              //Insertar
              _evento_ = evento;
              entity.Eventos.Add(_evento_);
              entity.SaveChanges();

              response.Descripcion = "El evento ha sido agregado";
            }

            response.IDActivo = _evento_.IDEvento;
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
    /// Autoriza el evento guardando en el estatus el sector en forma
    /// de lista separados por pipes: 8|3|2
    /// </summary>
    /// <param name="evento"></param>
    /// <returns></returns>
    [Route("_3/Eventos/Autorizar")]
    [HttpPost]
    public HttpResponseMessage Autorizar([FromBody] Eventos evento)
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
            Eventos _evento_;
            Diag_D response = new Diag_D();

            //Actualizar
            List<Eventos> ev = entity.Eventos.ToList();
            _evento_ = ev.Find(w => w.IDEvento == evento.IDEvento);
            _evento_.FechaModificacion = DateTime.Now;
            //Obtener estatus y separarlo en una lista. Ejemplo: 8|4|1
            List<string> estatus = _evento_.Estatus != null && _evento_.Estatus.Length > 0 ? _evento_.Estatus.Split('|').ToList() : new List<string>();
            if (estatus.IndexOf(evento.Estatus) >= 0)
            {
              response.Descripcion = "El Evento ya estaba autorizado";
            }
            else
            {
              estatus.Add(evento.Estatus);
              _evento_.Estatus = String.Join("|", estatus.ToArray());
              response.Descripcion = "El Evento ha sido autorizado";
              entity.SaveChanges();
            }


            response.IDActivo = _evento_.IDEvento;

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
  }
}
