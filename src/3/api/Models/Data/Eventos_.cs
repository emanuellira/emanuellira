using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Data
{
  public class Eventos_
  {
    public int IDEvento { get; set; }
    public string Fenomeno { get; set; }
    public string Nombre { get; set; }
    public System.DateTime FechaEvento { get; set; }
    public System.DateTime FechaCreacion { get; set; }
    public System.DateTime FechaModificacion { get; set; }
    public string Estatus { get; set; }
    public Nullable<int> Eliminado { get; set; }
    public string Autoriza { get; set; }
  }
}
