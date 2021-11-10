using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using DataAccess;
using System.Net;
using System.Net.Http;
//using api.Models;
using api.Models.Login;

namespace api.Controllers
{
  /// <summary>
  /// Métodos para trabajar con el inicio de sesión
  /// [# version: 3.7.12 #]
  /// </summary>
  public class LoginController : ApiController
  {

    /// <summary>
    /// Revisa el inicio de sesión
    /// </summary>
    /// <param name="data">datos del usuario</param>
    /// <returns></returns>
    public HttpResponseMessage Post([FromBody] Usuarios_View data)
    {
      try
      {
        var req = Request;
        var headers = req.Headers;
        string API = headers.GetValues("Sired_api_key").First();
        Usuario usuario = new Usuario();
        string bd_api_key_ = usuario.Get_BD_By_ApiKey(API);
        using (SIRED_Entities entity = new SIRED_Entities(bd_api_key_))
        {
          Usuarios_View _usuario_view_ = entity.Usuarios_View.ToList()
            .Find(u => u.NomUsuario == data.NomUsuario);

          if (_usuario_view_ != null)
          {

            usuario = new Usuario(_usuario_view_);

            if (usuario.Verificar(data.Password, _usuario_view_))
            {

              Usuarios _usuario_ = entity.Usuarios.ToList()
                .Find(u => u.IDUsuario == usuario.IDUsuario);

              _usuario_.Hit += 1;
              _usuario_.Token = usuario.Token;
              _usuario_.Key1 = usuario.Key1;
              _usuario_.IV = usuario.IV;
              _usuario_.Sesiones = usuario.SesionesIniciadas;
              _usuario_.LimiteSesiones = usuario.LimiteSesion;
              _usuario_.FechaModificado = DateTime.Now;

              entity.SaveChanges();

              usuario.Password = string.Empty;
              usuario.Key1 = string.Empty;
              usuario.IV = string.Empty;

              return Request.CreateResponse(HttpStatusCode.OK, usuario);
            }
            else
            {
              if (usuario.Bloqueado)
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "El usuario ha superado el número de sesiones");
              else
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, "Error en el inicio de sesión");
            }
          }
          else
          {
            return Request.CreateErrorResponse(HttpStatusCode.NotFound, "No existe una cuenta con los datos proporcionados");
          }
        }
      }
      catch (Exception err)
      {
        return Request.CreateErrorResponse(HttpStatusCode.BadRequest, $"Error al consultar la información. {err}");
      }
    }
    /// <summary>
    /// Cierra la sesión
    /// </summary>
    /// <param name="data">IDUsuario para cerrar sesión</param>
    /// <returns></returns>
    [Route("_3/Login/CloseSession")]
    [HttpPost]
    public HttpResponseMessage CloseSession([FromBody] Usuarios data)
    {
      try
      {
        var req = Request;
        var headers = req.Headers;
        data.Token = headers.GetValues("Authorization").First();
        string API = headers.GetValues("Sired_api_key").First();
        Usuario _usuario_ = new Usuario();
        if (_usuario_.ExisteToken(data.Token, API))
        {
          using (SIRED_Entities entity = new SIRED_Entities(_usuario_.API))
          {
            Usuarios _usuario_close_ = entity.Usuarios.ToList()
              .Find(u => u.IDUsuario == data.IDUsuario);
            if (_usuario_close_.Sesiones > 0)
            {
              _usuario_close_.Sesiones -= 1;
              entity.SaveChanges();
            }

            return Request.CreateResponse(HttpStatusCode.OK, "Se ha cerrado la sesión");
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
