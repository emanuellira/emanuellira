using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;

namespace api.Models.Data
{
  /// <summary>
  /// Métodos para trabajar con los datos preliminares
  /// [# version: 3.1.2 #]
  /// </summary>
  public class Data_AccionDef
  {
    /// <summary>
    /// Prepara la información enviada como preliminar para generar
    /// las acciones y poder insertar y actualizar la información
    /// </summary>


    public Data_AccionDef() { }
    /// <summary>
    /// Clase que contendrá los datos del definitivo
    /// </summary>
    public AccionDef Acciondef { get; set; }
    /// <summary>
    /// Se puede usar para recibir los datos del preliminar
    /// </summary>
    public AccionPre Accionpre { get; set; }
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
    /// <param name="accion"></param>
    public void Get_AccionDef(AccionPre accion)
    {
      AccionPre accionpre = new AccionPre
      // Si se agregan forekeys
      {
        ActivoPre = new ActivoPre()
      };
      Acciondef = new AccionDef();


      foreach (PropertyInfo property in accionpre.GetType().GetProperties())
      {
        try
        {
          if (property.Name == "ActivoPre") continue;
          Property_Name = property.Name;
          string valor = property.GetValue(accion).ToString();

          foreach (PropertyInfo property_def in Acciondef.GetType().GetProperties())
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
                    case 0: //string;
                      property_def.SetValue(Acciondef, valor);
                      break;
                    case 1://int;
                      property_def.SetValue(Acciondef, int.Parse(valor));
                      break;
                    case 2: //double;
                      property_def.SetValue(Acciondef, double.Parse(valor));
                      break;
                    case 3: //datetime
                      property_def.SetValue(Acciondef, DateTime.Parse(valor));
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
        catch
        {

        }
      }
    }
    /// <summary>
    /// Obtiene los datos enviados para su actualización y los
    /// asigna al definitivo para poder salvar los cambios
    /// </summary>
    /// <param name="accion"></param>
    public void Set_AccionDef(AccionPre accion)
    {
      AccionPre accionpre = new AccionPre
      // Si se agregan forekeys
      {
        ActivoPre = new ActivoPre()
      };
      //Acciondef = new AccionDef();

      foreach (PropertyInfo property in accionpre.GetType().GetProperties())
      {
        try
        {
          if (property.Name == "ActivoPre") continue;
          Property_Name = property.Name;
          string valor = property.GetValue(accion).ToString();

          foreach (PropertyInfo property_def in Acciondef.GetType().GetProperties())
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
                    case 0: //string;
                      property_def.SetValue(Acciondef, valor);
                      break;
                    case 1://int;
                      property_def.SetValue(Acciondef, int.Parse(valor));
                      break;
                    case 2: //double;
                      property_def.SetValue(Acciondef, double.Parse(valor));
                      break;
                    case 3: //datetime
                      property_def.SetValue(Acciondef, DateTime.Parse(valor));
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
        catch
        {

        }
      }
    }
    /// <summary>
    /// Obtiene los datos enviados para su actualización y los
    /// asigna al preliminar para poder salvar los cambios
    /// </summary>
    /// <param name="accion"></param>
    public void Set_AccionPre(AccionPre accion)
    {
      AccionPre accionpre = new AccionPre
      //Si se agregan forekeys
      {
        ActivoPre = new ActivoPre()
      };
      //Acciondef = new AccionDef();

      foreach (PropertyInfo property in accionpre.GetType().GetProperties())
      {
        try
        {
          if (property.Name == "ActivoPre") continue;
          Property_Name = property.Name;
          string valor = property.GetValue(accion).ToString();

          foreach (PropertyInfo property_def in Accionpre.GetType().GetProperties())
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
                    case 0: //string;
                      property_def.SetValue(Accionpre, valor);
                      break;
                    case 1://int;
                      property_def.SetValue(Accionpre, int.Parse(valor));
                      break;
                    case 2: //double;
                      property_def.SetValue(Accionpre, double.Parse(valor));
                      break;
                    case 3: //datetime
                      property_def.SetValue(Accionpre, DateTime.Parse(valor));
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
        catch
        {

        }
      }
    }
  }
}
