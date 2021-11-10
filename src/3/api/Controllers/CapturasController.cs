using api.Models.Borrar;
using api.Models.Data;
using api.Models.Error;
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
    /// Métodos para trabajar con las capturas de daños
    /// [# version: 3.7.10 #]
    /// </summary>
    public class CapturasController : ApiController
    {
        /// <summary>
        /// Obtiene las captura por IDUsuario
        /// </summary>
        /// <param name="data">Recibe el tipo y el IDUsuario</param>
        /// <returns></returns>
        public HttpResponseMessage Post([FromBody] Usuario data)
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
                        if (data.Tipo == "Captura")
                        {
                            //List<Diagnosticos_Pre> diags = entity.Diagnosticos_Pre
                            //  .Where(d => d.IDUsuario == data.IDUsuario).ToList();
                            var diags_temp = entity.Diagnosticos_Pre
                              .Where(d => d.IDUsuario == data.IDUsuario);

                            List<Diagnosticos_Pre> diags = diags_temp.ToList();
                            return Request.CreateResponse(HttpStatusCode.OK, diags);
                        }
                        else
                        {
                            List<Diagnosticos_Def> diags = entity.Diagnosticos_Def
                            .Where(d => d.IDUsuario == data.IDUsuario && d.Estatus != "APP").ToList();

                            return Request.CreateResponse(HttpStatusCode.OK, diags);
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
        /// Elimina una captura por id
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [Route("_3/Capturas/Eliminar")]
        [HttpPost]
        public HttpResponseMessage Eliminar([FromBody] Diag_D data)
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

                        if (data.Tipo == "Captura")
                        {
                            AccionPre diag = entity.AccionPre.First(d => d.IDAccion == data.IDAccion);
                            diag.Eliminado = 1;
                        }
                        else
                        {
                            AccionDef diag = entity.AccionDef.First(d => d.IDAccion == data.IDAccion);
                            diag.Eliminado = 1;
                        }
                        entity.SaveChanges();
                        Diag_D resultado = new Diag_D()
                        {
                            Descripcion = "El elemento se ha eliminado"
                        };
                        return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
        /// Insertar los datos enviados desde el dispositivo móvil
        /// </summary>
        /// <param name="activo">Datos de la captura</param>
        /// <returns>IDActivo</returns>
        [Route("_3/Capturas/InsertarActivo")]
        [HttpPost]
        public HttpResponseMessage InsertarActivo([FromBody] ActivoPre activo) 
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
                        activo.FechaCreacion = DateTime.Now;
                        activo.FechaModificacion = DateTime.Now;

                        entity.ActivoPre.Add(activo);
                        entity.SaveChanges();

                        Data_ActivoDef data_activo = new Data_ActivoDef();
                        data_activo.Get_ActivoDef(activo);

                        ActivoDef activodef = data_activo.Activodef;
                        entity.ActivoDef.Add(activodef);
                        entity.SaveChanges();

                        Diag_D resultado = new Diag_D() { IDActivo = activo.IDActivo };
                        return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
        /// Actualiza los datos enviados desde la web
        /// </summary>
        /// <param name="activo"></param>
        /// <returns></returns>
        [Route("_3/Capturas/GuardarActivo/{tipousuario}")]
        [HttpPost]
        public HttpResponseMessage GuardarActivo(string tipousuario, [FromBody] ActivoPre activo)
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
                        activo.FechaModificacion = DateTime.Now;
                        activo.EstatusAseguramiento = "SIRED";
                        ActivoDef activodef = entity.ActivoDef.ToList()
                          .Find(w => w.IDActivo == activo.IDActivo);

                        Data_ActivoDef data_activo = new Data_ActivoDef
                        {
                            Activodef = activodef
                        };
                        data_activo.Set_ActivoDef(activo);
                        //activodef = data_activo.Activodef;
                        if (tipousuario == "Captura")
                        {
                            ActivoPre activopre = entity.ActivoPre.ToList()
                            .Find(w => w.IDActivo == activo.IDActivo);

                            data_activo.Activopre = activopre;
                            data_activo.Set_ActivoPre(activo);
                        }

                        entity.SaveChanges();

                        Diag_D resultado = new Diag_D() { Tipo = tipousuario, Descripcion = "Se ha actualizado la información", IDActivo = activo.IDActivo };
                        return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
        /// Inserta los datos de los diagnósticos enviados desde el dispositivo móvil
        /// </summary>
        /// <param name="accion"></param>
        /// <returns></returns>
        [Route("_3/Capturas/InsertarAccion")]
        [HttpPost]
        public HttpResponseMessage InsertarAccion([FromBody] AccionPre accion)
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
                        accion.FechaCreacion = DateTime.Now;
                        accion.FechaModificacion = DateTime.Now;

                        entity.AccionPre.Add(accion);
                        entity.SaveChanges();

                        Data_AccionDef data_accion = new Data_AccionDef();
                        data_accion.Get_AccionDef(accion);

                        AccionDef acciondef = data_accion.Acciondef;
                        entity.AccionDef.Add(acciondef);
                        entity.SaveChanges();

                        Diag_D resultado = new Diag_D() { Descripcion = "Se ha guardado la accion (diagnóstico)" };
                        return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
        /// Actualiza los datos enviados desde la web
        /// </summary>
        /// <param name="tipousuario"></param>
        /// <param name="accion"></param>
        /// <returns></returns>
        [Route("_3/Capturas/GuardarAccion/{tipousuario}")]
        [HttpPost]
        public HttpResponseMessage GuardarAccion(string tipousuario, [FromBody] AccionPre accion)
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
                        accion.FechaModificacion = DateTime.Now;
                        accion.Estatus = "SIRED";

                        AccionDef acciondef = entity.AccionDef.ToList()
                          .Find(w => w.IDAccion == accion.IDAccion);

                        Data_AccionDef data_accion = new Data_AccionDef
                        {
                            Acciondef = acciondef
                        };
                        data_accion.Set_AccionDef(accion);
                        //activodef = data_activo.Activodef;
                        if (tipousuario == "Captura")
                        {
                            AccionPre accionpre = entity.AccionPre.ToList()
                            .Find(w => w.IDAccion == accion.IDAccion);

                            data_accion.Accionpre = accionpre;
                            data_accion.Set_AccionPre(accion);
                        }

                        entity.SaveChanges();

                        Diag_D resultado = new Diag_D() { Tipo = tipousuario, Descripcion = "Se ha actualizado la información", IDActivo = accion.IDActivo, IDAccion = accion.IDAccion };
                        return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
        /// Guarda los datos del entrevistado
        /// </summary>
        /// <param name="entrevista"></param>
        /// <returns></returns>
        [Route("_3/Capturas/InsertarEntrevista")]
        [HttpPost]
        public HttpResponseMessage InsertarEntrevista([FromBody] Entrevista entrevista)
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
                        entity.Entrevista.Add(entrevista);
                        entity.SaveChanges();

                        Diag_D resultado = new Diag_D() { Descripcion = "Se han guardado los datos del entrevistado" };
                        return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
        /// Obtiene los datos del entrevistado si existe
        /// </summary>
        /// <param name="IDActivo"></param>
        /// <returns></returns>
        [Route("_3/Capturas/DatosEntrevista/{IDActivo}")]
        [HttpGet]
        public HttpResponseMessage DatosEntrevista(int IDActivo)
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
                        Entrevista entrevista = entity.Entrevista.ToList().Find(f => f.IDActivo == IDActivo);
                        return Request.CreateResponse(HttpStatusCode.OK, entrevista);
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
