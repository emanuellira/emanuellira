using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Borrar
{
  /// <summary>
  /// Para recibir en el body el tipo y el ID
  /// </summary>
  public class Diag_D
  {
    /// <summary>
    /// Tipo para definir Preliminar o Definitivo
    /// </summary>
    public string Tipo { get; set; }
    /// <summary>
    /// IDAccion para definir el elemento de captura
    /// </summary>
    public int IDAccion { get; set; }
    /// <summary>
    /// IDActivo para definir el elemento de captura
    /// </summary>
    public int IDActivo { get; set; }
    /// <summary>
    /// Cualquier otro ID
    /// </summary>
    public int ID { get; set; }
    /// <summary>
    /// Descripción de la información
    /// </summary>
    public string Descripcion { get; set; }
    /// <summary>
    /// Guarda la url de algún archivo o controlador de la api
    /// </summary>
    public string Url { get; set; }
  }
}
