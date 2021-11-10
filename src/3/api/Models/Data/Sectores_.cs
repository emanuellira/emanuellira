using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Data
{
  public class Sectores_
  {
    public int ID { get; set; }
    public int ClaveSector { get; set; }
    public string NomSector { get; set; }
    public Nullable<int> Tipo { get; set; }
    public string AbrevMin { get; set; }
    public string Ministerio { get; set; }
    public int Activo { get; set; }
    public System.DateTime FechaCreado { get; set; }
    public System.DateTime FechaModificado { get; set; }
    public int VersionCat { get; set; }
    public System.DateTime FechaVersionCat { get; set; }
  }
}
