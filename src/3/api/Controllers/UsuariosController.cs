using api.Models.Borrar;
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
  /// Métodos para trabajar con el usuario
  /// [# version: 3.7.3 #]
  /// </summary>
  public class UsuariosController : ApiController
  {
    /// <summary>
    /// Retorna un usuario o una lista dependiendo del id
    /// </summary>
    /// <param name="id">Si es 0 retorna todos los usuarios</param>
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
            if (id > 0)
            {
              Usuarios_View usuario = entity.Usuarios_View.ToList().Find(f => f.IDUsuario == id);
              usuario.Token = "";
              usuario.Password = "";
              usuario.Key1 = "";
              usuario.IV = "";

              return Request.CreateResponse(HttpStatusCode.OK, usuario);
            }
            else
            {
              List<Usuarios_View> usuarios = entity.Usuarios_View.Where(w => w.IDUsuario > 2).ToList();
              foreach (Usuarios_View usuario in usuarios)
              {
                usuario.Token = "";
                usuario.Password = "";
                usuario.Key1 = "";
                usuario.IV = "";
              }
              return Request.CreateResponse(HttpStatusCode.OK, usuarios);
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
    /// <summary>
    /// Desbloquear usuario
    /// </summary>
    /// <param name="data">IDUsuario a desbloquear</param>
    /// <returns></returns>
    [Route("_3/Usuarios/UnlockUser")]
    [HttpPost]
    public HttpResponseMessage UnlockUser([FromBody] Usuarios data)
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
            Usuarios _usuario_unlock_ = entity.Usuarios.ToList()
              .Find(u => u.IDUsuario == data.IDUsuario);

            _usuario_unlock_.Sesiones = 0;
            entity.SaveChanges();

            return Request.CreateResponse(HttpStatusCode.OK, "Se ha desbloqueado al usuario solicitado");
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
    /// Obtiene el usuario relacionado al evento
    /// </summary>
    /// <param name="IDActivo"></param>
    /// <returns></returns>
    [Route("_3/Usuarios/Evento/{IDEvento}/{Sector}")]
    [HttpGet]
    public HttpResponseMessage Evento(int IDEvento, int Sector)
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
            Usuarios_View usuario = entity.Usuarios_View.ToList().Find(f => f.IDEvento == IDEvento && f.Sector == Sector);
            return Request.CreateResponse(HttpStatusCode.OK, usuario);
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
    /// Para guardar los datos del usuario: Si el IDUsuario es igual a 0,
    /// el usuario se inserta como uno nuevo. Si el IDUsuario es mayor a 0,
    /// el usuario se busca y se actualiza.
    ///               usuario -> El usuario enviado desde el front
    ///             _usuario_ -> El usuario que contiene los métodos y propiedades a trabajar
    /// _usuario_a_modificar_ -> El usuario a actualizar o a insertar
    /// </summary>
    /// <param name="usuario"></param>
    /// <returns></returns>
    [Route("_3/Usuarios/Guardar")]
    [HttpPost]
    public HttpResponseMessage Guardar([FromBody] Usuarios usuario)
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
            Diag_D resultado = new Diag_D();
            Usuarios _usuario_a_modificar_;
            if (usuario.IDUsuario > 0)
            {
              /*** El usuario existe ***/
              _usuario_a_modificar_ = entity.Usuarios.ToList().Find(f => f.IDUsuario == usuario.IDUsuario);
              if (_usuario_a_modificar_ != null)
              {
                _usuario_a_modificar_.FechaModificado = DateTime.Now;
                //_usuario_a_modificar_.Cargo = usuario.Cargo;
                //_usuario_a_modificar_.Correo = usuario.Correo;
                string new_pass = usuario.Password.Trim();
                if (new_pass.Length > 0)
                {
                  //Nueva contraseña
                  _usuario_.Password = usuario.Password;
                  //Fecha de creación del usuario
                  _usuario_.FechaCreado = _usuario_a_modificar_.FechaCreado;
                  //Se encriptan los datos
                  _usuario_a_modificar_.Password = _usuario_.Set_Password();
                }
                _usuario_a_modificar_.Nombre = usuario.Nombre;
                _usuario_a_modificar_.Apellidos = usuario.Apellidos;
                _usuario_a_modificar_.Cargo = usuario.Cargo;
                _usuario_a_modificar_.Correo = usuario.Correo;
                _usuario_a_modificar_.Telefono = usuario.Telefono;
                _usuario_a_modificar_.LimiteSesiones = usuario.LimiteSesiones;
                _usuario_a_modificar_.FechaExpira = usuario.FechaExpira;
                _usuario_a_modificar_.Token = _usuario_a_modificar_.Token;

                entity.SaveChanges();

                resultado.ID = usuario.IDUsuario;
                resultado.Tipo = usuario.NomUsuario;
                resultado.Descripcion = $"Se ha actualizado el usuario";
                return Request.CreateResponse(HttpStatusCode.OK, resultado);
              }
              resultado.ID = usuario.IDUsuario;
              resultado.Tipo = usuario.NomUsuario;
              resultado.Descripcion = $"No se encontró el usuario a modificar";
              return Request.CreateResponse(HttpStatusCode.OK, resultado);
            }
            else
            {
              /*** El usuario no existe, se inserta ***/
              //Datos para encriptar contraseña
              Usuarios verificar_usuario = entity.Usuarios.ToList().Find(f => f.NomUsuario == usuario.NomUsuario);
              if (verificar_usuario != null)
              {
                resultado.ID = verificar_usuario.IDUsuario;
                resultado.Tipo = "Error";
                resultado.Descripcion = $"Ya existe un usuario con la cuenta {usuario.NomUsuario}";
                return Request.CreateResponse(HttpStatusCode.OK, resultado);
              }

              _usuario_.Password = usuario.Password;
              _usuario_.FechaCreado = DateTime.Now;

              _usuario_a_modificar_ = new Usuarios
              {
                Apellidos = usuario.Apellidos,
                Nombre = usuario.Nombre,
                Bloqueo = 0,
                Cargo = usuario.Cargo,
                Correo = usuario.Correo,
                FechaCreado = _usuario_.FechaCreado,
                FechaExpira = usuario.FechaExpira,
                FechaModificado = _usuario_.FechaCreado,
                Hit = 0,
                IDEvento = usuario.IDEvento,
                IDPerfil = usuario.IDPerfil,
                IDProvincia = usuario.IDProvincia,
                LimiteSesiones = usuario.LimiteSesiones,
                NomUsuario = usuario.NomUsuario,
                Password = _usuario_.Set_Password(),
                Sector = usuario.Sector,
                Sesiones = usuario.Sesiones,
                Telefono = usuario.Telefono,
                Token = usuario.Token
              };

              entity.Usuarios.Add(_usuario_a_modificar_);
              entity.SaveChanges();

              resultado.ID = _usuario_a_modificar_.IDUsuario;
              resultado.Tipo = _usuario_a_modificar_.NomUsuario;
              resultado.Descripcion = $"Se agregó el nuevo usuario";
              return Request.CreateResponse(HttpStatusCode.OK, resultado);
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

    [Route("_3/Usuarios/Delete/{id}")]
    [HttpGet]
    public HttpResponseMessage Delete(int id)
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
            Diag_D resultado = new Diag_D();
            Usuarios _usuario_a_eliminar_;
            if (id > 0)
            {
              _usuario_a_eliminar_ = entity.Usuarios.ToList().Find(f => f.IDUsuario == id);
              /*** El usuario existe ***/
              if (_usuario_a_eliminar_ != null)
              {
                //entity.Usuarios.Remove(_usuario_a_eliminar_);
                entity.Entry(_usuario_a_eliminar_).State = System.Data.Entity.EntityState.Deleted;
                entity.SaveChanges();

                resultado.ID = _usuario_a_eliminar_.IDUsuario;
                resultado.Tipo = _usuario_a_eliminar_.NomUsuario;
                resultado.Descripcion = $"Se ha eliminado el usuarios";
                return Request.CreateResponse(HttpStatusCode.OK, resultado);
              }
              resultado.Descripcion = $"No se encontró el usuario a eliminar";
              return Request.CreateResponse(HttpStatusCode.OK, resultado);
            }
            else
            {
              resultado.Descripcion = $"ID Incorrecto";
              return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
