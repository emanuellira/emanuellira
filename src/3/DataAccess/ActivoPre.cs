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
    
    public partial class ActivoPre
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public ActivoPre()
        {
            this.AccionPre = new HashSet<AccionPre>();
        }
    
        public int IDActivo { get; set; }
        public int IDUsuario { get; set; }
        public int IDDIVADMIN1 { get; set; }
        public string DIVADMIN1 { get; set; }
        public int IDDIVADMIN3 { get; set; }
        public string DIVADMIN3 { get; set; }
        public int IDDIVADMIN2 { get; set; }
        public string DIVADMIN2 { get; set; }
        public string Reunion { get; set; }
        public string Domicilio { get; set; }
        public double Longitud { get; set; }
        public double Latitud { get; set; }
        public string Foto1 { get; set; }
        public string Foto2 { get; set; }
        public string Foto3 { get; set; }
        public string Foto4 { get; set; }
        public int IDSector { get; set; }
        public string CPS { get; set; }
        public string Ministerio { get; set; }
        public string EstatusAseguramiento { get; set; }
        public int ApoyosAnteriores { get; set; }
        public double PoblacionAfectada { get; set; }
        public string UnidadMedida { get; set; }
        public string ZonaAfectada { get; set; }
        public string TipoZonaAfectada { get; set; }
        public string InmuebleDaniado { get; set; }
        public string Material { get; set; }
        public string Responsable { get; set; }
        public string Titular { get; set; }
        public string Cargo { get; set; }
        public int IDEvento { get; set; }
        public System.DateTime FechaCreacion { get; set; }
        public System.DateTime FechaModificacion { get; set; }
        public string InfraDa { get; set; }
        public string Clave { get; set; }
        public int Eliminado { get; set; }
        public string FContactoTel { get; set; }
        public string FContactoMail { get; set; }
        public string CES1Activo { get; set; }
        public string CES2Activo { get; set; }
        public Nullable<System.DateTime> FechaSiembra { get; set; }
        public string Localidad { get; set; }
        public string TipoAdmin { get; set; }
        public string Nivel { get; set; }
        public double AreaTerreno { get; set; }
        public int AguaPotable { get; set; }
        public int Drenaje { get; set; }
        public int Energia { get; set; }
        public Nullable<System.DateTime> FechaCaptura { get; set; }
        public string AccesoInm { get; set; }
        public double AreaConstruccion { get; set; }
        public int DrenajePluvial { get; set; }
        public int TrenAseo { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<AccionPre> AccionPre { get; set; }
        public virtual Eventos Eventos { get; set; }
        public virtual Sectores Sectores { get; set; }
        public virtual Usuarios Usuarios { get; set; }
    }
}
