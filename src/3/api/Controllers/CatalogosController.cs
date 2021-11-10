using api.Models.Borrar;
using api.Models.Data;
using api.Models.Login;
using api.Models.Reportes;
using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace api.Controllers
{
  /// <summary>
  /// Métodos para trabajar con los catálogos,
  /// [# version: 3.7.8 #]
  /// </summary>
  public class CatalogosController : ApiController
  {
    /// <summary>
    /// Obtiene los catálogos del sector solicitado en el id
    /// </summary>
    /// <returns>Catálogos</returns>
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
            //List<Catalogos> catalogos = entity.Catalogos.Where(s => s.Sectores.Contains(id.ToString())).ToList();
            var temp = entity.Catalogos.ToList();
            List<Catalogos> catalogos = temp.Where(w => w.Sectores.Split('|').Contains(id.ToString())).ToList();
            var datosUM = catalogos.Where(w => w.Grupo == "UnidadM");
            var datosCM = catalogos.Where(w => w.Grupo == "ClaveM");
            var datosAux = new List<Catalogos>();
            foreach (var dcm in datosCM)
            {
              string[] valueUM = dcm.Descripcion.Split('~');
              if (valueUM.Length > 1)
              {
                foreach (var dum in datosUM)
                {
                  if (!dum.Valor.Equals(valueUM[1]))
                  {
                    Catalogos datoaux = new Catalogos
                    {
                      ID = 0,
                      Grupo = "UnidadM",
                      Valor = valueUM[1],
                      Descripcion = "",
                      Sectores = dcm.Sectores
                    };
                    datosAux.Add(datoaux);
                  }
                }
              }
            }

            List<Catalogos> lista = (from p in datosAux
                                     group p by new { p.Grupo, p.Valor, p.Sectores } into grupo
                                     where grupo.Count() > 1
                                     select new Catalogos()
                                     {
                                       Grupo = grupo.Key.Grupo,
                                       Valor = grupo.Key.Valor,
                                       Sectores = grupo.Key.Sectores
                                     }).ToList();
            foreach (var item in lista)
            {
              catalogos.Add(item);
            }

            return Request.CreateResponse(HttpStatusCode.OK, catalogos);
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
    /// Obtiene la versión de los catálogos
    /// </summary>
    /// <returns>versión</returns>
    [Route("_3/Catalogos/Version")]
    [HttpGet]
    public HttpResponseMessage Version()
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
            return Request.CreateResponse(HttpStatusCode.OK, entity.VersionCatalog.ToList());
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

    [Route("_3/Catalogos/Version2")]
    [HttpGet]
    public HttpResponseMessage Version2()
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

            List<Sectores> _sectores_ = entity.Sectores.Where(x => x.Activo == 1).ToList();

            List<string> lst = new List<string>();
            foreach (var s in _sectores_)
            {
              if (s.VersionCat > 0)
                lst.Add($"{s.ClaveSector};{s.VersionCat}");
            }

            Diag_D resultado = new Diag_D
            {
              Descripcion = String.Join("|", lst.ToArray())
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

    [Route("_3/Catalogos/UpdateVersion/{id}")]
    [HttpGet]
    public HttpResponseMessage UpdateVersion(int id)
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

            Sectores _sector_ = entity.Sectores.ToList().Find(w => w.ClaveSector == id);
            _sector_.VersionCat += 1;
            _sector_.FechaVersionCat = DateTime.Now;

            entity.SaveChanges();

            Diag_D resultado = new Diag_D
            {
              Descripcion = "Se ha actualizado la versión del Catálogo",
              ID = id
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
    /// Obtiene la lista de departamentos (o su correspondiente) ordenados por NOMBRE
    /// </summary>
    /// <returns>Departamentos</returns>
    [Route("_3/Catalogos/Div_Admin2")]
    [HttpGet]
    public HttpResponseMessage Div_Admin2()
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
            var departamentos = from s in entity.DIV_ADMIN2 select new { s.CVE, s.NOMBRE, s.DIVADMIN1, s.DIVADMIN2 };
            return Request.CreateResponse(HttpStatusCode.OK, departamentos.OrderBy(o => o.NOMBRE).ToList());
          };
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
    /// Obtiene la lista de municipios (o su correspondiente) ordenados por NOMBRE
    /// </summary>
    /// <returns>Municipios</returns>
    [Route("_3/Catalogos/Div_Admin3/{IDDIVADMIN2}")]
    [HttpGet]
    public HttpResponseMessage Div_Admin3(int IDDIVADMIN2)
    {
      //string _IDDIVADMIN3_ = "";
      //if (IDDIVADMIN3 != null)
      //  _IDDIVADMIN3_ = IDDIVADMIN3;
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
            var municipios = from muns in entity.DIV_ADMIN3 select new { muns.CVE, muns.NOMBRE, muns.DIVADMIN1, muns.DIVADMIN2, muns.DIVADMIN3 };

            List<DIV_ADMIN3> lst_muns = new List<DIV_ADMIN3>();
            foreach (var m in municipios.OrderBy(o => o.NOMBRE).ToList())
            {
              lst_muns.Add(new DIV_ADMIN3() { CVE = m.CVE, NOMBRE = m.NOMBRE, DIVADMIN1 = m.DIVADMIN1, DIVADMIN2 = m.DIVADMIN2, DIVADMIN3 = m.DIVADMIN3 });
            }

            if (IDDIVADMIN2 > 0)
            {
              return Request.CreateResponse(HttpStatusCode.OK, lst_muns.Where(w => int.Parse(w.DIVADMIN2) == IDDIVADMIN2).OrderBy(o => o.NOMBRE));
            }
            return Request.CreateResponse(HttpStatusCode.OK, lst_muns.OrderBy(o => o.NOMBRE));

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
    /// Obtiene la lista de los Sectores que se encuentran activos
    /// </summary>
    /// <returns>Sectores</returns>
    [Route("_3/Catalogos/Sectores")]
    [HttpGet]
    public HttpResponseMessage Sectores()
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
            List<Sectores> _sectores_ = entity.Sectores.Where(x => x.Activo == 1).ToList();
            List<Sectores_> sectores_ = new List<Sectores_>();
            _sectores_.ForEach((s) =>
            {
              sectores_.Add(new Sectores_()
              {
                ID = s.ID,
                ClaveSector = s.ClaveSector,
                NomSector = s.NomSector,
                Tipo = s.Tipo,
                AbrevMin = s.AbrevMin,
                Ministerio = s.Ministerio,
                Activo = s.Activo,
                FechaCreado = s.FechaCreado,
                FechaModificado = s.FechaModificado,
                VersionCat = s.VersionCat,
                FechaVersionCat = s.FechaVersionCat
              });
            });
            return Request.CreateResponse(HttpStatusCode.OK, sectores_);
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
    /// Obtiene la lista de los Sectores que se encuentran activos
    /// </summary>
    /// <returns>Sectores</returns>
    [Route("_3/Catalogos/Perfiles")]
    [HttpGet]
    public HttpResponseMessage Perfiles()
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
            var _perfiles_ = from p in entity.Perfil where p.IDPerfil != 1 && p.IDPerfil != 3 select new { p.IDPerfil, p.Nivel, p.Descripcion, p.Tipo };
            return Request.CreateResponse(HttpStatusCode.OK, _perfiles_.ToList().OrderBy(o => o.Tipo));
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
    /// Actualiza la versión de los catálogos
    /// </summary>
    /// <returns>Diag_D</returns>
    [Route("_3/Catalogos/UpdateVersion")]
    [HttpPost]
    public HttpResponseMessage UpdateVersion([FromBody] VersionCatalog data)
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
            data.Fecha_Actualizacion = DateTime.Now;
            VersionCatalog _vercat_ = entity.VersionCatalog.ToList()[0];
            _vercat_.Fecha_Actualizacion = DateTime.Now;
            _vercat_.VersionCatalogos++;
            _vercat_.Sectores = data.Sectores;
            entity.SaveChanges();
            response.Descripcion = "Se ha actualizado correctamente la versión de los catálogos";
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
    /// 
    /// </summary>
    /// <param name="data"></param>
    /// <returns></returns>
    [Route("_3/Catalogos/Insert")]
    [HttpPost]
    public HttpResponseMessage Insert([FromBody] Reporte data)
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
          //using (SIRED_Entities entity = new SIRED_Entities(_usuario_.API))
          //{
          Diag_D response = new Diag_D();
          api.Models.Api_Paths.Paths path = new Models.Api_Paths.Paths(data);
          var fp = path.Fisical_Path;
          response = CargarCSV_WS(data, fp, _usuario_.API);
          return Request.CreateResponse(HttpStatusCode.OK, response);
          //}
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
    /// TIPOERROR Tipoerror = TIPOERROR.SinError;
    /// 0. Sin Error
    /// 1. No encuentra el tipo de catálogo
    /// 2. Tipo de catálogo no coincide con el seleccionado
    /// 3. El formato del csv es incorrecto
    /// 4. HREF
    /// 5. Blancos:
    ///   si tipo = 1: no debe tener blancos en ningún campo
    ///   sino si tipo = 2 o 3: no debe tener blancos en descripción
    ///   sino ....      
    /// </summary>
    /// <param name="data"></param>
    /// <param name="path"></param>
    /// <returns></returns>
    private Diag_D CargarCSV_WS(Reporte data, string path, string _api_key_)
    {
      Diag_D response = new Diag_D
      {
        Tipo = string.Empty,
        Descripcion = string.Empty
      };
      try
      {

        string tipoCatalogo = data.Tipo_Doc;// 1-Infraestructura
        int idSector = data.IDUsuario;//Es el ID del Sector, se puso de esta forma para no impactar otros metódos
        string nameFile = data.Descripcion;
        string pathAux = string.Format(@"Catalogos\{0}", nameFile);
        string FilePath = path + string.Format(@"Catalogos\{0}", nameFile);
        bool isCorrectDoc = false;
        bool isCSVCPC = false;
        string line;
        string csvtext = string.Empty;

        // Read the file and display it line by line.  
        System.IO.StreamReader file = new System.IO.StreamReader(FilePath, Encoding.GetEncoding("iso-8859-1"));
        //Leer la primera línea para comprobar el tipo de catálogo
        line = file.ReadLine();
        string[] firstline = line.Split(',');
        List<Catalogos> lstCatalogo = new List<Catalogos>();
        Catalogos itemCat = new Catalogos();
        //comprobar el número del catálogo
        string numcat = firstline[1].Substring(0, 1);
        string[] row;
        if (int.TryParse(numcat, out int intnumcat))
        {
          if (intnumcat < 5)
          {
            while (!file.EndOfStream && !isCorrectDoc)
            {
              line = file.ReadLine();
              isCorrectDoc = line.Split(',')[0].Trim() == "Clave";
            }
            if (isCorrectDoc)
            {
              lstCatalogo = new List<Catalogos>();
              while (!file.EndOfStream)
              {
                itemCat = new Catalogos();
                line = file.ReadLine();
                isCSVCPC = false;
                if (line.Split(';').Length > 1)
                {
                  isCSVCPC = true;
                }
                if (isCSVCPC)
                {
                  row = line.Split(';');
                }
                else
                {
                  row = line.Split(',');
                }
                switch (tipoCatalogo)
                {
                  case "Clave":
                    if (ContieneValor(row, "#¡REF!"))
                    {
                      response.Tipo = "El archivo CSV contiene valores incorrectos.";
                      return response;
                    }
                    else if (ContieneValor(row, string.Empty))
                    {
                      response.Tipo = "El archivo CSV contiene valores en blanco.";
                      return response;
                    }
                    else
                    {
                      itemCat.Grupo = data.Tipo_Doc;
                      itemCat.Valor = row[0].Trim();
                      itemCat.Descripcion = row[1].Trim();
                      itemCat.Sectores = idSector.ToString();
                      lstCatalogo.Add(itemCat);
                      itemCat = new Catalogos();
                      if (row.Length > 3)
                      {
                        itemCat.Grupo = "ClaveM";// Unidad de Medida
                        itemCat.Valor = row[0].Trim();
                        itemCat.Descripcion = $"{row[2]}~{row[3]}";
                        itemCat.Sectores = idSector.ToString();
                        lstCatalogo.Add(itemCat);
                      }
                    }
                    break;
                  default:
                    string[] rowaux = new string[] { row[1] };
                    if (ContieneValor(rowaux, "#¡REF!"))
                    {
                      response.Tipo = "El archivo CSV contiene valores incorrectos en el campo descripción.";
                      return response;
                    }
                    else if (ContieneValor(rowaux, string.Empty))
                    {
                      response.Tipo = "El archivo CSV contiene valores en blanco en el campo descripción.";
                      return response;
                    }
                    else
                    {
                      itemCat.Grupo = data.Tipo_Doc;
                      itemCat.Valor = row[0].Trim();
                      itemCat.Descripcion = row[1].Trim();
                      itemCat.Sectores = idSector.ToString();
                      lstCatalogo.Add(itemCat);
                    }
                    break;
                }
              }
            }
            else
            {
              response.Tipo = "El archivo CSV no tiene el formato correcto, verificar que sea un archivo CSV separado por comas.";
              return response;
            }
          }
          else
          {
            response.Tipo = "El catálogo seleccionado no corresponde al catálogo del archivo CSV";
            return response;
          }
        }
        else
        {
          response.Tipo = "No se pudo encontrar el tipo de catálogo en el archivo CSV";
          return response;
        }
        file.Close();
        if (lstCatalogo.Count > 0)
        {
          if (DeleteCatalogos(data.Tipo_Doc, idSector.ToString(), _api_key_))
          {
            if (InsertCatalogosBD(lstCatalogo, _api_key_))
            {
              response.Descripcion = "Se han cargado los catálogos a SIRED-CA";
            }
            else
            {
              response.Tipo = "Ha ocurrido un error al insertar los catálogos";
              return response;
            }
          }
          else
          {
            response.Tipo = "Ha ocurrido un error al eliminar los catálogos pertenecientes al Sector";
            return response;
          }
        }
      }
      catch (Exception ex)
      {
        response.Tipo = ex.Message;
        return response;
      }
      response.Descripcion = "Se han cargado los catálogos a SIRED - CA";
      return response;
    }

    public bool DeleteCatalogos(string tipo, string sector, string _api_key_)
    {
      try
      {
        using (SIRED_Entities entity = new SIRED_Entities(_api_key_))
        {
          var lstCat = entity.Catalogos.Where(b => b.Grupo == tipo && b.Sectores == sector);
          foreach (var item in lstCat)
          {
            entity.Catalogos.Remove(item);
          }
          if (tipo == "Clave")
          {
            var lstClaveM = entity.Catalogos.Where(b => b.Grupo == "ClaveM" && b.Sectores == sector);
            foreach (var item in lstClaveM)
            {
              entity.Catalogos.Remove(item);
            }
          }
          entity.SaveChanges();
          return true;
        }
      }
      catch
      {
        return false;
      }
    }

    private bool ContieneValor(string[] arr, string valor)
    {
      int count = arr.Length;
      for (int i = 0; i < count; i++)
      {
        if (arr[i] == valor)
          return true;
      }

      return false;

    }
    private bool InsertCatalogosBD(List<Catalogos> lstCatalogos, string _api_key_)
    {
      try
      {
        using (SIRED_Entities entity = new SIRED_Entities(_api_key_))
        {
          foreach (var item in lstCatalogos)
          {
            entity.Catalogos.Add(item);
          }
          entity.SaveChanges();
          return true;
        }
      }
      catch
      {
        return false;
      }
    }
  }
}
