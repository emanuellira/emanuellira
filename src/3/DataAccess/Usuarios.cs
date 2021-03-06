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
    
    public partial class Usuarios
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Usuarios()
        {
            this.ActivoPre = new HashSet<ActivoPre>();
        }
    
        public int IDUsuario { get; set; }
        public int IDEvento { get; set; }
        public int IDPerfil { get; set; }
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string NomUsuario { get; set; }
        public string Password { get; set; }
        public System.DateTime FechaCreado { get; set; }
        public System.DateTime FechaModificado { get; set; }
        public string Token { get; set; }
        public string Key1 { get; set; }
        public string IV { get; set; }
        public int Sesiones { get; set; }
        public int LimiteSesiones { get; set; }
        public System.DateTime FechaExpira { get; set; }
        public Nullable<int> Bloqueo { get; set; }
        public Nullable<int> Hit { get; set; }
        public Nullable<int> Sector { get; set; }
        public string Telefono { get; set; }
        public string Correo { get; set; }
        public string Cargo { get; set; }
        public int IDProvincia { get; set; }
    
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<ActivoPre> ActivoPre { get; set; }
        public virtual Perfil Perfil { get; set; }
    }
}
