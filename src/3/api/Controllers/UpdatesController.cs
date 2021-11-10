using api.Models.Borrar;
using api.Models.Login;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace api.Controllers
{
    /// <summary>
    /// Métodos para trabajar con los catálogos,
    /// [# version: 3.7.4 #]
    /// </summary>
    public class UpdatesController : ApiController
    {
        /// <summary>
        /// Controlador para buscar actualizaciones de:
        /// * Versión aplicación móvil
        /// * Configuración json de la aplicación móvil
        /// </summary>
        public HttpResponseMessage Post([FromBody] Diag_D data)
        {
            try
            {
                var req = Request;
                var headers = req.Headers;
                var Token = headers.GetValues("Authorization").First();
                //string API = headers.GetValues("Sired_api_key").First();

                Usuario _usuario_ = new Usuario();
                List<string> lstDirectorios = new List<string>();
                //if (_usuario_.ExisteToken(Token, API))
                //{
                    Diag_D resultado = new Diag_D() { };
                    if (!Directory.Exists(data.Url))
                    {
                        resultado.Descripcion = $"No se encontraron archivos en: [{data.Url}]";
                    }
                    string[] Directorios = Directory.GetDirectories(data.Url);
                    foreach (string s in Directorios)
                    {
                        char[] separators = new char[] { '\\', '/' };
                        string[] nombre = s.Split(separators);
                        lstDirectorios.Add(nombre[nombre.Length - 1]);
                    }
                    resultado.Url = data.Url;
                    resultado.Descripcion = string.Empty;
                    if (lstDirectorios.Count > 0)
                        resultado.Descripcion = string.Join("|", lstDirectorios);
                    return Request.CreateResponse(HttpStatusCode.OK, resultado);
                //}
                //else
                //{
                //    return Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "El token no es correcto");
                //}
            }
            catch (Exception err)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, err);
            }
        }

    }
}
