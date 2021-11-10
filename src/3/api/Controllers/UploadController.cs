using api.Models.Borrar;
using api.Models.Login;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;

namespace api.Controllers
{
    /// <summary>
    /// Métodos para trabajar con el envío de archivos
    /// [# version: 3.7.3 #]
    /// </summary>
    public class UploadController : ApiController
    {
        /// <summary>
        /// Recibe a través de un data-form:
        /// url: Que se refiere al path complementario
        /// fileName: Para dar el nombre al archivo que se va a guardar
        /// File: El archivo a guardar
        /// </summary>
        /// <returns></returns>
        public HttpResponseMessage Post()
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
                    //Crear el path
                    string str_debug = HttpContext.Current.Request.Form["Debug"];
                    bool Debug = str_debug != null && str_debug == "true";
                    string dir_replace = Debug ? "3\\api" : "api";

                    string path = AppDomain.CurrentDomain.BaseDirectory.ToLower().Replace(dir_replace, "assets");
                    string path_complementario = HttpContext.Current.Request.Form["url"];
                    path = $"{path}{path_complementario}";

                    Diag_D resultado = new Diag_D() { Url = path };
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }

                    //Buscar el archivo.
                    HttpPostedFile postedFile = HttpContext.Current.Request.Files[0];

                    ////Crear el nuevo nombre del archivo.
                    string fileName = $"{HttpContext.Current.Request.Form["fileName"]}{Path.GetExtension(postedFile.FileName)}";

                    ////Guardar el archivo.
                    postedFile.SaveAs($"{path}\\{fileName}");

                    resultado.Tipo = fileName;
                    resultado.Descripcion = "Se ha guardado el archivo";
                    resultado.Url = $"assets/{path_complementario}";

                    return Request.CreateResponse(HttpStatusCode.OK, resultado);
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
