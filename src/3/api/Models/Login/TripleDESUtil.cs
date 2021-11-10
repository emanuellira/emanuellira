using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Security.Cryptography;
using System.IO;

namespace api.Models
{
    /// <summary>
    /// version 0.1.2
    /// </summary>
    class TripleDESUtil
    {
        public byte[] IV { get; set; }
        public byte[] Key { get; set; }

        public TripleDESUtil() { }

        public string DesEncriptar(byte[] message)
        {
            TripleDES cryptoProvider = new TripleDESCryptoServiceProvider();
            ICryptoTransform cryptoTransform = cryptoProvider.CreateDecryptor(Key, IV);

            MemoryStream memoryStream = new MemoryStream(message);
            CryptoStream cryptoStream = new CryptoStream(memoryStream, cryptoTransform, CryptoStreamMode.Read);
            StreamReader sr = new StreamReader(cryptoStream, true);
            string textoLimpio = sr.ReadToEnd();

            return textoLimpio;
        }
        public byte[] EncriptarPassword(string cadenaOrigen, DateTime fc)
        {
            try
            {
                UTF8Encoding encoding = new UTF8Encoding();
                byte[] message = encoding.GetBytes(cadenaOrigen);

                //TripleDESCryptoServiceProvider criptoProvider = new TripleDESCryptoServiceProvider();
                RijndaelManaged criptoProvider = new RijndaelManaged();
                string d = "0" + fc.Day;
                string m = "0" + fc.Month;
                string y = "0" + fc.Year;
                //min = min.Substring(min.Length - 2, 2);
                d = d.Substring(d.Length - 2, 2);
                m = m.Substring(m.Length - 2, 2);
                y = y.Substring(y.Length - 4, 4);
                //"FmKqsVh1nchJxBwN" + d + y + m + d + m + y
                byte[] key = Encoding.UTF8.GetBytes("FmKqsVh1nchJxBwN" + d + y + m + d + m + y);
                byte[] iv = Encoding.UTF8.GetBytes("voahr84GybFfxcLc");
                ICryptoTransform criptoTransform = criptoProvider.CreateEncryptor(key, iv);
                MemoryStream memoryStream = new MemoryStream();
                CryptoStream cryptoStream = new CryptoStream(memoryStream, criptoTransform, CryptoStreamMode.Write);
                cryptoStream.Write(message, 0, message.Length);
                // cryptoStream.Flush();
                cryptoStream.FlushFinalBlock();
                byte[] encriptado = memoryStream.ToArray();
                string cadenaEncriptada = encoding.GetString(encriptado);
                //Console.WriteLine("Texto encriptado:{0}", cadenaEncriptada);
                //Console.WriteLine();
                return encriptado;                
            }
            catch (Exception)
            {
                return null;
            }
        }
        public byte[] Encriptar(string cadenaOrigen)
        {
            UTF8Encoding encoding = new UTF8Encoding();
            byte[] message = encoding.GetBytes(cadenaOrigen);

            TripleDESCryptoServiceProvider criptoProvider = new TripleDESCryptoServiceProvider();

            IV = criptoProvider.IV;
            Key = criptoProvider.Key;
            ICryptoTransform criptoTransform = criptoProvider.CreateEncryptor(Key, IV);
            MemoryStream memoryStream = new MemoryStream();
            CryptoStream cryptoStream = new CryptoStream(memoryStream, criptoTransform, CryptoStreamMode.Write);
            cryptoStream.Write(message, 0, message.Length);
            // cryptoStream.Flush();
            cryptoStream.FlushFinalBlock();
            byte[] encriptado = memoryStream.ToArray();
            //string cadenaEncriptada = encoding.GetString(encriptado);
            //Console.WriteLine("Texto encriptado:{0}", cadenaEncriptada);
            //Console.WriteLine();
            return encriptado;
        }

        public string DecryptStringFromBytes(string encrypted, DateTime fecha)
        {
            //string min = "0" + DateTime.Now.Minute;
            string d = "0" + fecha.Day;
            string m = "0" + fecha.Month;
            string y = "0" + fecha.Year;
            //min = min.Substring(min.Length - 2, 2);
            d = d.Substring(d.Length - 2, 2);
            m = m.Substring(m.Length - 2, 2);
            y = y.Substring(y.Length - 4, 4);
            byte[] key = Encoding.UTF8.GetBytes("FmKqsVh1nchJxBwN" + d + y + m + d + m + y);
            byte[] iv = Encoding.UTF8.GetBytes("voahr84GybFfxcLc");
            byte[] cipherText = Convert.FromBase64String(encrypted);
            // Check arguments. 
            if (cipherText == null || cipherText.Length <= 0)
            {
                throw new ArgumentNullException("cipherText");
            }
            if (key == null || key.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }
            if (iv == null || iv.Length <= 0)
            {
                throw new ArgumentNullException("key");
            }

            // Declare the string used to hold 
            // the decrypted text. 
            string plaintext = null;

            // Create an RijndaelManaged object 
            // with the specified key and IV. 
            using (var rijAlg = new RijndaelManaged())
            {
                //Settings 
                rijAlg.Mode = CipherMode.CBC;
                rijAlg.Padding = PaddingMode.PKCS7;
                rijAlg.FeedbackSize = 128;

                try
                {
                    rijAlg.Key = key;
                    rijAlg.IV = iv;

                    // Create a decrytor to perform the stream transform. 
                    var decryptor = rijAlg.CreateDecryptor(rijAlg.Key, rijAlg.IV);

                    // Create the streams used for decryption. 
                    using (var msDecrypt = new MemoryStream(cipherText))
                    {
                        using (var csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                        {

                            using (var srDecrypt = new StreamReader(csDecrypt))
                            {
                                // Read the decrypted bytes from the decrypting stream 
                                // and place them in a string. 
                                plaintext = srDecrypt.ReadToEnd();

                            }

                        }
                    }
                }
                catch
                {
                    plaintext = "keyError";
                }
            }

            return plaintext;
        }
    }
}
