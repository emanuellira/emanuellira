using iText.IO.Image;
using iText.Layout.Element;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFSharpFlow.PDFFlowable_Classes
{
  public class PDFFlowable_Image
  {
    //private string Url_Image { get; }
    //private string Image_Name { get; }
    private readonly Image image;
    public Image Get_Image() => image;
    public PDFFlowable_Image(string _path_, string _name_, float _x_, float _y_, float _w_, float _h_)
    {
      string path = $"{_path_}/{_name_}";
      if (File.Exists(path))
      {
        image = new Image(ImageDataFactory.Create(path));
        image.SetFixedPosition(_x_, _y_);
        image.SetWidth(_w_);
        image.SetHeight(_h_);
      }
    }
  }
}
