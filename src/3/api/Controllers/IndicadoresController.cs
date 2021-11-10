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
    /// Métodos para trabajar con indicadores
    /// [# version: 3.7.3 #]
    /// </summary>
    public class IndicadoresController : ApiController
    {
        /// <summary>
        /// Obtiene los indicadores de CostoTotalR por divadmin2
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [Route("_3/Indicadores/CostoTotalRXDIVADMIN2")]
        [HttpPost]
        public HttpResponseMessage CostoTotalRXDIVADMIN2([FromBody] Diag_D data)
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
                        var diags_temp = entity.Diagnosticos_Pre.Where(d => d.IDUsuario == data.ID);

                        List<Diagnosticos_Pre> diags = diags_temp.ToList();

                        var total_group = from x in diags
                                          group x by x.DIVADMIN2 into x_group
                                          select new { key = x_group.Key, ID = x_group.ElementAt(0).IDDIVADMIN2, monto = x_group.Sum(s => s.CostoTotalR) };

                        List<Diag_D> resultados = new List<Diag_D>();
                        foreach (var d in total_group)
                        {
                            resultados.Add(new Diag_D() { ID = (int)d.ID, Tipo = d.key, Descripcion = d.monto.ToString() });
                        }

                        return Request.CreateResponse(HttpStatusCode.OK, resultados);
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
        /// Obtiene los indicadores de CostoTotalR x divadmin3
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [Route("_3/Indicadores/CostoTotalRXDIVADMIN3")]
        [HttpPost]
        public HttpResponseMessage CostoTotalRXDIVADMIN3([FromBody] Diag_D data)
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
                        var diags_temp = data.IDAccion < 0 ?
                          entity.Diagnosticos_Pre.Where(d => d.IDUsuario == data.ID) :
                          entity.Diagnosticos_Pre.Where(d => d.IDUsuario == data.ID && d.IDDIVADMIN2 == data.IDAccion);

                        List<Diagnosticos_Pre> diags = diags_temp.ToList();

                        var total_group = from x in diags
                                          group x by x.DIVADMIN3 into x_group
                                          select new { key = x_group.Key, ID = x_group.ElementAt(0).IDDIVADMIN3, monto = x_group.Sum(s => s.CostoTotalR) };

                        List<Diag_D> resultados = new List<Diag_D>();
                        foreach (var d in total_group)
                        {
                            resultados.Add(new Diag_D() { Tipo = d.key, ID = d.ID, Descripcion = d.monto.ToString() });
                        }

                        return Request.CreateResponse(HttpStatusCode.OK, resultados);
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
        /// Obtiene los indicadores de poblacionafectada x divadmin2
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [Route("_3/Indicadores/PoblacionAfectadaXDIVADMIN2")]
        [HttpPost]
        public HttpResponseMessage PoblacionAfectadaXDIVADMIN2([FromBody] Diag_D data)
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
                        var diags_temp = entity.Diagnosticos_Pre.Where(d => d.IDUsuario == data.ID);

                        List<Diagnosticos_Pre> diags = diags_temp.ToList();

                        var total_group = from x in diags
                                          group x by x.DIVADMIN2 into x_group
                                          select new { key = x_group.Key, ID = x_group.ElementAt(0).IDDIVADMIN2, monto = x_group.Sum(s => s.PoblacionAfectada) };

                        List<Diag_D> resultados = new List<Diag_D>();
                        foreach (var d in total_group)
                        {
                            resultados.Add(new Diag_D() { Tipo = d.key, ID = (int)d.ID, Descripcion = d.monto.ToString() });
                        }

                        return Request.CreateResponse(HttpStatusCode.OK, resultados);
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
        /// Obtiene los indicadores de poblacion afectada por divadmin3
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [Route("_3/Indicadores/PoblacionAfectadaXDIVADMIN3")]
        [HttpPost]
        public HttpResponseMessage PoblacionAfectadaXDIVADMIN3([FromBody] Diag_D data)
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
                        var diags_temp = data.IDAccion < 0 ?
                          entity.Diagnosticos_Pre.Where(d => d.IDUsuario == data.ID) :
                          entity.Diagnosticos_Pre.Where(d => d.IDUsuario == data.ID && d.IDDIVADMIN2 == data.IDAccion);

                        List<Diagnosticos_Pre> diags = diags_temp.ToList();

                        var total_group = from x in diags
                                          group x by x.DIVADMIN3 into x_group
                                          select new { key = x_group.Key, ID = x_group.ElementAt(0).IDDIVADMIN3, monto = x_group.Sum(s => s.PoblacionAfectada) };

                        List<Diag_D> resultados = new List<Diag_D>();
                        foreach (var d in total_group)
                        {
                            resultados.Add(new Diag_D() { Tipo = d.key, ID = d.ID, Descripcion = d.monto.ToString() });
                        }

                        return Request.CreateResponse(HttpStatusCode.OK, resultados);
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
