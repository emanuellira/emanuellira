using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace api.Models.Data
{
  /// <summary>
  /// Métodos para trabajar con los datos del activo
  /// [# version: 3.1.3 #]
  /// </summary>
  public class Data_ActivoDef
  {
    readonly List<string> exclude = new List<string>() { "AccionPre", "Eventos", "Sectores", "Usuarios" };


    /// <summary>
    ///  Prepara la información enviada como definitiva para generar
    ///  los activos y poder insertar y actualizar la información
    /// </summary>

    public Data_ActivoDef() { }
    /// <summary>
    /// Clase que contendrá los datos del definitivo
    /// </summary>
    public ActivoDef Activodef { get; set; }
    /// <summary>
    /// Se puede usar para recibir los datos del preliminar
    /// </summary>
    public ActivoPre Activopre { get; set; }
    /// <summary>
    /// Nombre de la propiedad del preliminar
    /// </summary>
    public string Property_Name { get; set; }
    /// <summary>
    /// Nombre de la propiedad del definitivo
    /// </summary>
    public string Property_Name_Def { get; set; }
    /// <summary>
    /// Obtiene los datos del preliminar y los asigna al definitivo
    /// cuando va a insertar la información
    /// </summary>
    /// <param name="activo"></param>
    public void Get_ActivoDef(ActivoPre activo)
    {
      ActivoPre activopre = new ActivoPre();
      Activodef = new ActivoDef();

      foreach (PropertyInfo property in activopre.GetType().GetProperties())
      {
        Property_Name = property.Name;
        if (!exclude.Contains(Property_Name))
        {
          string valor = property.GetValue(activo).ToString();

          foreach (PropertyInfo property_def in Activodef.GetType().GetProperties())
          {
            Property_Name_Def = property_def.Name;


            if (Property_Name_Def == Property_Name)
            {
              int i = 0;

              while (i < 4)
              {
                try
                {
                  switch (i)
                  {
                    case 0: //string
                      property_def.SetValue(Activodef, valor);
                      break;
                    case 1://int
                      property_def.SetValue(Activodef, int.Parse(valor));
                      break;
                    case 2://double
                      property_def.SetValue(Activodef, double.Parse(valor));
                      break;
                    case 3://datetime
                      property_def.SetValue(Activodef, DateTime.Parse(valor));
                      break;
                  }
                  i = 4;
                }
                catch
                {
                  i++;
                }
              }
              break;
            }
          }
        }
      }
    }
    /// <summary>
    /// Obtiene los datos enviados para su actualización y los
    /// asigna al definitivo para poder salvar los cambios
    /// </summary>
    /// <param name="activo"></param>
    public void Set_ActivoDef(ActivoPre activo)
    {
      ActivoPre _activodef_ = new ActivoPre();
      //Activodef = new ActivoDef();
      foreach (PropertyInfo property in _activodef_.GetType().GetProperties())
      {
        Property_Name = property.Name;

        if (!exclude.Contains(Property_Name))
        {
          string valor = property.GetValue(activo).ToString();

          foreach (PropertyInfo property_def in Activodef.GetType().GetProperties())
          {
            Property_Name_Def = property_def.Name;

            if (Property_Name_Def == Property_Name)
            {
              int i = 0;

              while (i < 4)
              {
                try
                {
                  switch (i)
                  {
                    case 0: //string
                      property_def.SetValue(Activodef, valor);
                      break;
                    case 1://int
                      property_def.SetValue(Activodef, int.Parse(valor));
                      break;
                    case 2://double
                      property_def.SetValue(Activodef, double.Parse(valor));
                      break;
                    case 3://datetime
                      property_def.SetValue(Activodef, DateTime.Parse(valor));
                      break;
                  }
                  i = 4;
                }
                catch
                {
                  i++;
                }
              }
              break;
            }
          }
        }
      }
    }
    /// <summary>
    /// Obtiene los datos enviados para su actualización y los
    /// asigna al preliminar para poder salvar los cambios
    /// </summary>
    /// <param name="activo"></param>
    public void Set_ActivoPre(ActivoPre activo)
    {
      ActivoPre _activodef_ = new ActivoPre();
      //Activopre = new ActivoPre();

      foreach (PropertyInfo property in _activodef_.GetType().GetProperties())
      {
        Property_Name = property.Name;
        if (!exclude.Contains(Property_Name))
        {

          string valor = property.GetValue(activo).ToString();

          foreach (PropertyInfo property_def in Activopre.GetType().GetProperties())
          {
            Property_Name_Def = property_def.Name;

            if (Property_Name_Def == Property_Name)
            {
              int i = 0;

              while (i < 4)
              {
                try
                {
                  switch (i)
                  {
                    case 0: //string
                      property_def.SetValue(Activopre, valor);
                      break;
                    case 1://int
                      property_def.SetValue(Activopre, int.Parse(valor));
                      break;
                    case 2://double
                      property_def.SetValue(Activopre, double.Parse(valor));
                      break;
                    case 3://datetime
                      property_def.SetValue(Activopre, DateTime.Parse(valor));
                      break;
                  }
                  i = 4;
                }
                catch
                {
                  i++;
                }
              }
              break;
            }
          }
        }
      }
    }
  }
}
