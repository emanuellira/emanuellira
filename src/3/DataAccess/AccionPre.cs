//------------------------------------------------------------------------------
// <auto-generated>
//     Este código se generó a partir de una plantilla.
//
//     Los cambios manuales en este archivo pueden causar un comportamiento inesperado de la aplicación.
//     Los cambios manuales en este archivo se sobrescribirán si se regenera el código.
// </auto-generated>
//------------------------------------------------------------------------------

namespace DataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class AccionPre
    {
        public int IDAccion { get; set; }
        public int IDActivo { get; set; }
        public string Diagnostico { get; set; }
        public string Restauracion { get; set; }
        public string TipoDanio { get; set; }
        public double CostoUnitario { get; set; }
        public double CostoTotalObra { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        public string Estatus { get; set; }
        public string CES1 { get; set; }
        public string CES2 { get; set; }
        public string Observaciones { get; set; }
        public string Material { get; set; }
        public double Unidades { get; set; }
        public double CostoAdmin { get; set; }
        public double CostoTotalR { get; set; }
        public int Eliminado { get; set; }
    
        public virtual ActivoPre ActivoPre { get; set; }
    }
}
