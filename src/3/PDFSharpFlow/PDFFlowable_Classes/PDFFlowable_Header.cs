using iText.Kernel.Colors;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFSharpFlow.PDFFlowable_Classes
{
  public class PDFFlowable_Header
  {
    public List<string> Textos { get; set; } = new List<string>();
    public bool IsHeader { get; }
    public (bool, string) WithSeparator { get; set; } = (false, "#000000");
    public PDFFlowable_Header() {
      IsHeader = true;
    }
    public PDFFlowable_Header(bool _is_header_ ) {
      IsHeader = _is_header_;
    }
    public (bool, string) WithImage { get; set; } = (false, "");
  }
}
