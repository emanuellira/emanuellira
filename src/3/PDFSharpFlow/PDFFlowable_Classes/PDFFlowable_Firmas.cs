using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFSharpFlow.PDFFlowable_Classes
{
  
  public class PDFFlowable_Firmas
  {
    private List<string> Firmas { get; }
    private string Border_Color { get; }

    public List<string> Get_Firmas() => Firmas;
    public string Get_Border_Color() => Border_Color;
    public PDFFlowable_Firmas(List<string> _firmas_, string _border_color_)
    {
      Firmas = _firmas_;
      Border_Color = _border_color_;
    }
  }
}
