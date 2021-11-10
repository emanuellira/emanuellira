using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Error
{
  public class CError
  {
    private bool _he = false;
    public bool HayError
    {
      get { return _he; }
      set
      {
        _he = value;
      }
    }

    private string _m = string.Empty;
    public string Mensaje
    {
      get { return _m; }
      set
      {
        HayError = false;
        _m = value;
      }
    }

    private string _me = string.Empty;
    public string MensajeError
    {
      get { return _me; }
      set
      {
        HayError = true;
        _me = value;
      }
    }

    private string _et = string.Empty;
    public string MensajeErrorTecnico
    {
      get { return _et; }
      set
      {
        HayError = true;
        _et = value;
      }
    }
  }
}
