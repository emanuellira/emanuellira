using api.Models.Error;
using DataAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace api.Models.Login
{
  /// <summary>
  /// Datos del usuario
  /// [# version: 3.0.2 #]
  /// </summary>
  public class Usuario : CError
  {
    /// <summary>
    /// Identificador del usuario
    /// </summary>
    public int IDUsuario { get; set; }
    /// <summary>
    /// Identificador de lista consecutiva
    /// </summary>
    public int IDNumero { get; set; }
    /// <summary>
    /// Identificador del evento
    /// </summary>
    public int IDEvento { get; set; }
    /// <summary>
    /// Nombre de la cuenta de usuario
    /// </summary>
    public string NomUsuario { get; set; }
    /// <summary>
    /// Contraseña de la cuenta de usuario
    /// </summary>
    public string Password { get; set; }
    /// <summary>
    /// Nombre de la persona
    /// </summary>
    public string Nombre { get; set; }
    /// <summary>
    /// Apellidos de la persona
    /// </summary>
    public string Apellidos { get; set; }
    /// <summary>
    /// Fecha en que se creó el usuario
    /// </summary>
    public DateTime FechaCreado { get; set; }
    /// <summary>
    /// Fecha de expiración de la cuenta
    /// </summary>
    public DateTime FechaExpira { get; set; }
    /// <summary>
    /// ID del sector del usuario
    /// </summary>
    public int Sector { get; set; }
    /// <summary>
    /// Nombre del sector del usuario
    /// </summary>
    public string NomSector { get; set; }
    /// <summary>
    /// Identificador del perfil del usuario
    /// </summary>
    public int IdPerfil { get; set; }
    /// <summary>
    /// Permisos del usuario
    /// </summary>
    public string Nivel { get; set; }
    /// <summary>
    /// Descripción del perfil
    /// </summary>
    public string DescripcionPerfil { get; set; }
    /// <summary>
    /// Tipo de usuario: Captura, Administrador, AdministradorB, Normativo
    /// </summary>
    public string Tipo { get; set; }
    /// <summary>
    /// Identificadaor de la provincia del usuario
    /// </summary>
    public int IDProvincia { get; set; }
    /// <summary>
    /// Nombre de la provincia del usuario
    /// </summary>
    public string Provincia { get; set; }
    /// <summary>
    /// Token generado al iniciar sesión
    /// </summary>
    public string Token { get; set; }
    /// <summary>
    /// Key del token
    /// </summary>
    public string Key1 { get; set; }
    /// <summary>
    /// IV del token
    /// </summary>
    public string IV { get; set; }
    /// <summary>
    /// El token está caducado?
    /// </summary>
    public bool TokenCaducado { get; set; }
    /// <summary>
    /// Cantidad de sesiones iniciadas por la cuenta de usuario
    /// </summary>
    public int SesionesIniciadas { get; set; }
    /// <summary>
    /// Límite de sesiones: 10 por default
    /// </summary>
    public int LimiteSesion { get; set; }
    /// <summary>
    /// El usuario está bloqueado?
    /// </summary>
    public bool Bloqueado { get; set; }
    /// <summary>
    /// El usuario está caducado?
    /// </summary>
    public bool Caducado { get; set; }

    public string API { get; set; }

    /// <summary>
    /// Constructor sin parámetros
    /// </summary>
    public Usuario() { }
    /// <summary>
    /// Constructor que recibe un usuario
    /// </summary>
    /// <param name="_usuario_">datos del usuario</param>
    public Usuario(Usuarios_View _usuario_)
    {

      string token = _usuario_.Token;
      string key = _usuario_.Key1;
      string iv = _usuario_.IV;

      IDUsuario = _usuario_.IDUsuario;
      IDEvento = _usuario_.IDEvento;
      NomUsuario = _usuario_.NomUsuario;
      Password = _usuario_.Password;
      FechaCreado = _usuario_.FechaCreado;
      Password = Get_Password();
      Nombre = _usuario_.Nombre;
      Apellidos = _usuario_.Apellidos;
      Sector = (int)_usuario_.Sector;
      NomSector = _usuario_.NomSector;
      FechaExpira = _usuario_.FechaExpira;
      Caducado = FechaExpira <= DateTime.Now;
      SesionesIniciadas = _usuario_.Sesiones;
      LimiteSesion = _usuario_.LimiteSesiones;
      IdPerfil = _usuario_.IDPerfil;
      Nivel = _usuario_.Nivel;
      DescripcionPerfil = _usuario_.Descripcion;
      Tipo = _usuario_.Tipo;
      IDProvincia = _usuario_.IDProvincia;
      Provincia = _usuario_.Provincia;

      if (token != string.Empty)
      {
        Token = DesencriptarToken(token, key, iv);

        bool istokenvalido = IsTokenValido();
        HayError = false;
        if (!istokenvalido)
          SesionesIniciadas = 0;
      }
      Bloqueado = LimiteSesion == 0;

    }

    /// <summary>
    /// Si la contraseña es correcta y el límite de sesiones no se ha sobrepasado
    /// o no tiene límite de sesiones
    /// </summary>
    /// <param name="_pass_login_">Contraseña tecleada por el usuario</param>
    /// <returns></returns>
    internal bool Verificar(string _pass_login_, Usuarios_View _usuario_)
    {
      if (_pass_login_ == Password && (SesionesIniciadas < LimiteSesion || LimiteSesion == -1))
      {
        //string token = string.Empty;
        //string key = string.Empty;
        //string iv = string.Empty;

        if (SesionesIniciadas == 0)
        {
          /*--Si el último inicio de sesión tiene una diferencia mayor a 15 minutos--*/
          string cripto = GetPreToken(NomUsuario, _pass_login_);
          string[] datacripto = cripto.Split(' ');
          /* Estos se tienen que guardar en la tabla en el 
           * registro del usuario.*/
          Token = datacripto[0];
          Key1 = datacripto[1];
          IV = datacripto[2];
        }
        else
        {
          Token = _usuario_.Token;
          Key1 = _usuario_.Key1;
          IV = _usuario_.IV;
        }

        /*Incrementa y actualiza el número de sesiones iniciadas*/
        SesionesIniciadas++;

        return true;
      }

      Bloqueado = _pass_login_ == Password;
      Token = string.Empty;
      MensajeErrorTecnico = "Cuenta caducada / Bloqueada";

      return false;
    }

    /// <summary>
    /// Crea el token
    /// </summary>
    /// <param name="_usuario_">usuario</param>
    /// <param name="_password_">contraseña</param>
    /// <param name="_EsLogin_">es login</param>
    /// <returns></returns>
    internal string GetPreToken(string _usuario_, string _password_, bool _EsLogin_ = true)
    {
      TripleDESUtil cripto = new TripleDESUtil();
      string cadena;
      if (_EsLogin_)
        cadena = GetRandomArreglo(_usuario_, _password_);
      else
        cadena = _usuario_;/*Cadena personalizada*/

      byte[] bytetoken = cripto.Encriptar(cadena);

      string base64 = Convert.ToBase64String(bytetoken); // Standard base64 encoder
      base64 = base64.Split('=')[0]; // Remove any trailing '='s
      base64 = base64.Replace('+', '-'); // 62nd char of encoding
      base64 = base64.Replace('/', '_'); // 63rd char of encoding

      string s = base64
          + " " + Convert.ToBase64String(cripto.Key)
          + " " + Convert.ToBase64String(cripto.IV);

      return s;
    }

    /// <summary>
    /// Genera el random del token
    /// </summary>
    /// <param name="_usuario_">usuario</param>
    /// <param name="_password_">contraseña</param>
    /// <returns></returns>
    internal string GetRandomArreglo(string _usuario_, string _password_)
    {
      List<string> lst = new List<string>();
      string f = string.Format("f:{0}", DateTime.Now.ToString("ddMMyyyy"));
      string fc = string.Format("fc:{0}", DateTime.Now.AddHours(8).ToString("ddMMyyyyHHmmss"));
      string c = string.Format("c:{0}", 1);//Caduca: 1=SI, 0=NO

      lst.Add(string.Format("u:{0}", _usuario_));
      lst.Add(string.Format("p:{0}", _password_));
      lst.Add(f);
      lst.Add(fc);
      lst.Add(c);

      List<string> lstrnd = new List<string>
      {
        "0",
        "0",
        "0",
        "0",
        "0"
      };

      Random rnd = new Random();
      int i = 0;

      while (i < 5)
      {
        int r = rnd.Next(0, 5);
        if (lstrnd.ElementAt(r) == "0")
        {
          lstrnd[r] = lst.ElementAt(i);
          i++;
        }
      }

      string arreglo = string.Format("{0};{1};{2};{3};{4}", lstrnd[0], lstrnd[1], lstrnd[2], lstrnd[3], lstrnd[4]);

      return arreglo;
    }

    /// <summary>
    /// Desencriptar contraseña
    /// </summary>
    /// <returns></returns>
    internal string Get_Password()
    {
      string s = Password;
      s = s.Replace('-', '+'); // 62nd char of encoding
      s = s.Replace('_', '/'); // 63rd char of encoding
      switch (s.Length % 4) // Pad with trailing '='s
      {
        case 0: break; // No pad chars in this case
        case 2: s += "=="; break; // Two pad chars
        case 3: s += "="; break; // One pad char
        default:
          throw new System.Exception("Illegal base64url string!");
      }

      TripleDESUtil cripto = new TripleDESUtil();
      return cripto.DecryptStringFromBytes(s, FechaCreado);
    }

    /// <summary>
    /// Encripta la contraseña pero debe tener el password y la fecha
    /// de creación asignada previamente.
    /// </summary>
    /// <returns></returns>
    internal string Set_Password()
    {
      TripleDESUtil cripto = new TripleDESUtil();
      byte[] clave = cripto.EncriptarPassword(Password, FechaCreado);

      string base64 = Convert.ToBase64String(clave); // Standard base64 encoder
      base64 = base64.Split('=')[0]; // Remove any trailing '='s
      base64 = base64.Replace('+', '-'); // 62nd char of encoding
      base64 = base64.Replace('/', '_'); // 63rd char of encoding

      //string s = base64
      //    + " " + Convert.ToBase64String(cripto.Key)
      //    + " " + Convert.ToBase64String(cripto.IV);

      return base64;
    }

    /// <summary>
    /// Desencriptar token
    /// </summary>
    /// <param name="_token_">token</param>
    /// <param name="_key_">key</param>
    /// <param name="_iv_">iv</param>
    /// <returns></returns>
    internal string DesencriptarToken(string _token_, string _key_, string _iv_)
    {
      TripleDESUtil cripto = new TripleDESUtil();

      string s = _token_;
      s = s.Replace('-', '+'); // 62nd char of encoding
      s = s.Replace('_', '/'); // 63rd char of encoding
      switch (s.Length % 4) // Pad with trailing '='s
      {
        case 0: break; // No pad chars in this case
        case 2: s += "=="; break; // Two pad chars
        case 3: s += "="; break; // One pad char
        default:
          throw new System.Exception("Illegal base64url string!");
      }
      byte[] cifrado = Convert.FromBase64String(s); // Standard base64 decoder
      cripto.Key = Convert.FromBase64String(_key_);
      cripto.IV = Convert.FromBase64String(_iv_);

      string resultado = cripto.DesEncriptar(cifrado);

      return resultado;
    }
    /// <summary>
    /// Revisar el token y validarlo
    /// </summary>
    /// <returns></returns>
    internal bool IsTokenValido()
    {
      bool resultado = false;
      TokenCaducado = false;
      //if (!ERROR.HayError)//ERROR == null //El token si existe
      //{
      bool Caduca = true;
      string[] datos = Token.Split(';');
      string pass = string.Empty;
      string user = string.Empty;
      DateTime FechaCaducidad = new DateTime();
      //DateTime Fecha = new DateTime();
      for (int i = 0; i < datos.Length; i++)
      {
        string[] parametro = datos[i].Split(':');

        switch (parametro[0])
        {
          case "p":
            pass = parametro[1];
            break;
          case "u":
            user = parametro[1];
            break;
          case "f":
            //string F = string.Format("{0}/{1}/{2}", parametro[1].Substring(0, 2), parametro[1].Substring(2, 2), parametro[1].Substring(4, 4));
            //Fecha = DateTime.Parse(F);
            break;
          case "fc":
            string FC = string.Format("{0}/{1}/{2} {3}:{4}:{5}", parametro[1].Substring(0, 2), parametro[1].Substring(2, 2), parametro[1].Substring(4, 4), parametro[1].Substring(8, 2), parametro[1].Substring(10, 2), parametro[1].Substring(12, 2));
            FechaCaducidad = DateTime.Parse(FC);//, new CultureInfo("es-MX"), DateTimeStyles.NoCurrentDateDefault);
            break;
          case "c":
            Caduca = int.Parse("0" + parametro[1]) == 1;
            break;
          default:
            // El parámetro no ha sido agregado
            throw new NotImplementedException("El parámetro no ha sido agregado");

        }
      }
      /*Token caducado: TKN_CAD*/
      if (FechaCaducidad <= DateTime.Now && Caduca)
      {
        MensajeErrorTecnico = "TKN_CAD";
        TokenCaducado = true;
      }
      else
      {
        /*Comprobar que la cuenta del usuario sea igual a la del token ERROR_Token3*/
        if (user == NomUsuario && Password == pass)
        {
          resultado = true;
          //Password = string.Empty;
        }
        else
        {
          MensajeErrorTecnico = "ERROR_Token3";
        }
      }

      //API = Get_BD_By_ApiKey(_api_key_);

      return resultado;
    }

    public string Get_BD_By_ApiKey(string _api_key_)
    {
      Dictionary<string, string> lstApiKeys = new Dictionary<string, string>
      {
        { "168c547e-afb7-407f-8c25-7fc038898a89", "name = SIRED_Entities_HND" },
        { "eda42130-4dd3-4d75-b783-e76e289a2f90", "name = SIRED_Entities_GTM" },
        { "142b9630-c9e6-43fe-a723-0ec076ce5436", "name = SIRED_Entities_PAN" },
        { "b3a3fb14-7857-4d36-9853-afdaf5ae2ecf", "name = SIRED_Entities_SLV" },
        { "c8fcd186-9403-4d66-ad84-c14a57005e51", "name = SIRED_Entities_DRONES" },
        { "3e61fad0-ae43-450c-b14c-5f8b8b213a89", "name = SIRED_Entities_HTI" },
        { "dfa8d7a7-bcbb-4165-a12e-6ed81ba9b65a", "name = SIRED_Entities_[OTRO]" },
        { "ce85ebb6-064c-43b3-86bf-0c7904431ecb", "name = SIRED_Entities_[OTRO]" },
        { "fa256c99-31bc-4524-abf6-966f8e67c756", "name = SIRED_Entities_[OTRO]" }
      };

      if (lstApiKeys.TryGetValue(_api_key_, out string api))
      {
        return api;
      }

      return "";
    }
    /// <summary>
    /// El encabezado tiene token
    /// </summary>
    /// <param name="_token_"></param>
    /// <returns></returns>
    internal bool ExisteToken(string _token_, string _api_key_)
    {

      API = Get_BD_By_ApiKey(_api_key_);
      using (SIRED_Entities entity = new SIRED_Entities(API))
      {
        _token_ = _token_.Replace("Bearer ", "");
        Usuarios _usuario_ = entity.Usuarios.ToList().Find(u => u.Token == _token_);
        if (_usuario_ != null)
        {
          NomUsuario = _usuario_.NomUsuario;
          Password = _usuario_.Password;
          FechaCreado = _usuario_.FechaCreado;
          Password = Get_Password();
          IDUsuario = _usuario_.IDUsuario;
          Usuarios_View usuario_view = entity.Usuarios_View.ToList().Find(u => u.IDUsuario == IDUsuario);
          Tipo = usuario_view.Tipo;

          Token = DesencriptarToken(_token_, _usuario_.Key1, _usuario_.IV);

          return IsTokenValido();
        }

        return false;
      }
    }
  }
}
