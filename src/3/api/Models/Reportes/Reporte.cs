using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Reportes
{
  /// <summary>
  /// [# versión: 6.2.1 #]
  /// </summary>
  public class Reporte
  {
    /// <summary>
    /// Tipo de archivo:
    /// Para el caso de pruebas -> DOC_TEST, DOC_PRE, etc...
    /// </summary>
    public string Tipo_Doc { get; set; }
    /// <summary>
    /// Describe el archivo en el metadata
    /// </summary>
    public string Descripcion { get; set; }
    /// <summary>
    /// Indica si está en modo debug
    /// </summary>
    public bool Debug { get; set; }
    /// <summary>
    /// IDUsuario de captura
    /// </summary>
    public int IDUsuario { get; set; }
    /// <summary>
    /// IDSector de captura
    /// </summary>
    public int IDSector { get; set; }
    /// <summary>
    /// IDEvento
    /// </summary>
    public int IDEvento { get; set; }
    /// <summary>
    /// Lectura del json
    /// </summary>
    public string Url { get; set; }
    /// <summary>
    /// País abreviado
    /// </summary>
    public string Abr { get; set; }
    /// <summary>
    /// La Url tiene SSL?
    /// </summary>
    public bool SSL { get; set; }
    /// <summary>
    /// Cultura del país, ejemplo para guatemala: es-GT|,|.
    /// </summary>
    public string Culture { get; set; }
    /// <summary>
    /// Lista de firmas que se colocarán con el nombre y cargo  
    /// </summary>
    public List<string> Firmas { get; set; }
  }
}
