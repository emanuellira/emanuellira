using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFSharpFlow.PDFFlowable_Classes
{
  public class PDFFlowable_Cell
  {
    public string Value { get; set; }
    public string Color { get; set; } = "#ffffff";
    public (int, int, int, int, string) Borders = (1, 1, 1, 1, "#ffffff");
    public bool Bold { get; set; } = false;
    public string Style_Apply { get; set; } = null;
  }
  public class PDFFlowable_Table
  {
    public List<List<PDFFlowable_Cell>> Filas { get; set; } = new List<List<PDFFlowable_Cell>>();
  }
}
