﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    
    public partial class SIRED_Entities : DbContext
    {
        public SIRED_Entities()
            : base("name=SIRED_Entities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<AccionDef> AccionDef { get; set; }
        public virtual DbSet<AccionPre> AccionPre { get; set; }
        public virtual DbSet<ActivoDef> ActivoDef { get; set; }
        public virtual DbSet<ActivoPre> ActivoPre { get; set; }
        public virtual DbSet<Catalogos> Catalogos { get; set; }
        public virtual DbSet<DIV_ADMIN1> DIV_ADMIN1 { get; set; }
        public virtual DbSet<DIV_ADMIN2> DIV_ADMIN2 { get; set; }
        public virtual DbSet<DIV_ADMIN3> DIV_ADMIN3 { get; set; }
        public virtual DbSet<Entrevista> Entrevista { get; set; }
        public virtual DbSet<Eventos> Eventos { get; set; }
        public virtual DbSet<Perfil> Perfil { get; set; }
        public virtual DbSet<Sectores> Sectores { get; set; }
        public virtual DbSet<Usuarios> Usuarios { get; set; }
        public virtual DbSet<VersionCatalog> VersionCatalog { get; set; }
        public virtual DbSet<Diagnosticos_Def> Diagnosticos_Def { get; set; }
        public virtual DbSet<Diagnosticos_Pre> Diagnosticos_Pre { get; set; }
        public virtual DbSet<Usuarios_View> Usuarios_View { get; set; }
    }
}