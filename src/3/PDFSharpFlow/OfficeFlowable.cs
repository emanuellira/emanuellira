using PDFSharpFlow.PDFFlowable_Classes;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PDFSharpFlow
{
  public class OfficeFlowable
  {
    #region [Propiedades]
    private string Word__ { get; set; }
    public string Save_Path { get; }
    public string Url_Path { get; }
    public string File_Name { get; }

    private readonly string MARGENES = "70.85pt 3.0cm 70.85pt 3.0cm";
    private readonly List<string> Styles = new List<string>();

    #endregion

    public OfficeFlowable(string _save_path_, string _url_path_, string _file_name_)
    {
      Save_Path = _save_path_;
      Url_Path = _url_path_;
      File_Name = _file_name_;

      initDocument();
    }

    private void initDocument()
    {
      Word = string.Empty;
      Word = ("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">");
      string datoWord = "xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" " +
          "xmlns:m=\"http://schemas.microsoft.com/office/2004/12/omml\" xmlns=\"http://www.w3.org/TR/REC-html40\"";
      Word = $"<html {datoWord}><head><title>SIRED</title>";
      Word = "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />";
      Word = "<meta name=ProgId content=Word.Document>";
      Word = "<meta name=Generator content=\"Microsoft Word 14\">";
      Word = "<meta name=Originator content=\"Microsoft Word 14\">";
      Word = "<xml> <w:WordDocument> <w:View>Print</w:View> <w:Zoom>100</w:Zoom> </w:WordDocument> </xml>";
      Word = "<style>";

      //Incluye el encabezado y el pie de pagina
      Word = "@page WordSection1{";
      //Word = "mso-header-margin:.5in;";
      //Word = "mso-footer-margin:.5in;";
      //Word = "mso-header:h1;";
      //Word = "mso-footer:f1;";
      //Word = "mso-footer-margin:.5in;";
      Word = " __HEADER__ ";
      Word = " __FOOTER__ ";
      Word = $"margin:{MARGENES};";
      Word = "} div.WordSection1";
      Word = "{@page:WordSection1;}";

      Set_Styles();
      Word = String.Join("", Styles.ToArray());

      Word = "</style></head><body>";
      Word = "<div class=WordSection1>";

      Set_Formato_Default();
    }



    #region [Add]
    private string Word
    {
      set { Word__ += value; }
      get { return Word__; }
    }
    public void LineBreak(int NumeroSaltos = 1)
    {
      for (int i = 0; i < NumeroSaltos; i++)
        Word = "<br>";
    }

    public object Add
    {
      set
      {
        if (value is string)
        {
          Add_Paragraph(value.ToString());
        }
        else if (value is PDFFlowable_Table table)
        {
          Add_Table(table);
        }
        else if (value is PDFFlowable_Header header)
        {
          Add_Header(header);
        }
        //else if (value is PDFFlowable_Image image)
        //{
        //  Add_Image(image);
        //}
        else if (value is PDFFlowable_Firmas firmas)
        {
          Add_Firmas(firmas);
        }
      }
    }
    #endregion

    #region Firmas
    private void Add_Firmas(PDFFlowable_Firmas firmas)
    {
      List<string> list = firmas.Get_Firmas();
      if (list.Count == 0)
        return;

      PDFFlowable_Table value = new PDFFlowable_Table();

      //list.InsertRange(0, new List<string>() { "", "" });

      int i = 0;
      while (i < list.Count)
      {
        List<PDFFlowable_Cell> separator = new List<PDFFlowable_Cell>();
        List<PDFFlowable_Cell> fila = new List<PDFFlowable_Cell>();
        for (int newLine = 0; newLine < 2; newLine++)
        {
          if (i < list.Count)
          {
            string f = list[i].Replace(".-", "<br>");
            if (newLine == 1)
            {
              fila.Add(new PDFFlowable_Cell() { Value = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp", Borders = (-1, -1, -1, -1, firmas.Get_Border_Color()) });
              separator.Add(new PDFFlowable_Cell() { Value = "&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;", Borders = (-1, -1, -1, -1, firmas.Get_Border_Color()) });
              }
            fila.Add(new PDFFlowable_Cell() { Value = f, Style_Apply = "Normal_Firmas", Borders = (1, -1, -1, -1, firmas.Get_Border_Color()) });
            separator.Add(new PDFFlowable_Cell() { Value = "&nbsp;<br>&nbsp;<br>&nbsp;<br>&nbsp;", Borders = (-1, -1, -1, -1, firmas.Get_Border_Color()) });

            i++;
          }
        }

        value.Filas.Add(fila);
        value.Filas.Add(separator);
      }

      LineBreak(9);
      Add_Table(value);
    }
    #endregion

    #region [Function] Name-> Add_Header_Footer
    private void Add_Header(PDFFlowable_Header header)
    {
      /*** Obtener párrafos ***/
      List<string> header_paragraphs = new List<string>();
      for (int j = 0; j < header.Textos.Count; j++)
      {
        var item = header.Textos[j];
        header_paragraphs.Add(Get_Paragraph(item));
      }
      /*** Cambiar nombre de archivo para el header y el footer ***/      
      string save_hf = Save_Path.Replace(".doc", "_hf_.htm");
      string url_hf = $"{Url_Path}/reportespdf/{File_Name}_hf_.htm";
      /*** Es header o footer ***/
      string mso_hf = string.Empty;
      List<string> tr = new List<string>();
      //string mso_hf_end;
      if (header.IsHeader)
      {
        //mso_hf_end = "MsoHeader";

        //tr.Add("<tr style=\"mso-yfti-irow: 0;mso-yfti-firstrow: yes;mso-yfti-lastrow: yes;\">");
        //tr.Add("<td width=\"294\" valign=\"top\" style=\"width: 220.7pt; padding: 0cm 5.4pt 0cm 5.4pt\">");
        //tr.Add($"<p class=\"{mso_hf_end}\"><span style=\"mso-no-proof: yes\"></span></p>");
        //tr.Add("</td>");
        //tr.Add("<td width=\"462\" style=\"width: 346.35pt; padding: 0cm 5.4pt 0cm 5.4pt\">");
        //tr.Add($"<p class=\"{mso_hf_end}\" align=\"right\" style=\"text-align: right\">{String.Join("", header_paragraphs.ToArray())}</p>");
        //tr.Add("</td></tr>");

        Word__ = Word__.Replace("__HEADER__", "mso-header:url(" + url_hf + ") h1;");
        Word__ = Word__.Replace("__FOOTER__", "");
        mso_hf = "<div style=\"mso-element: header\" id=\"h1\">";
        tr.AddRange(header_paragraphs);       
      }
      else
      {
        //mso_hf_end = "MsoFooter";

        //tr.Add("<tr style=\"mso-yfti-irow: 0; mso-yfti-firstrow: yes\">");
        //tr.Add("<td width=\"832\" valign=\"top\" style=\"width: 623.75pt;border: none;border-top: solid #bdd6ee 1pt;");
        //tr.Add("mso-border-top-themecolor: accent1;mso-border-top-themetint: 102;mso-border-top-alt: solid #bdd6ee 0.5pt;");
        //tr.Add("mso-border-top-themecolor: accent1;mso-border-top-themetint: 102;padding: 0cm 5.4pt 0cm 5.4pt;\">");
        //tr.Add($"<p class=\"{mso_hf_end}\" align=\"center\" style=\"text-align: center\">{header_paragraphs[0]}</p>");
        //tr.Add("</td></tr>");

        //tr.Add("<tr style=\"mso-yfti-irow: 1; mso-yfti-lastrow: yes\">");
        //tr.Add("<td width=\"832\" valign=\"top\"");
        //tr.Add("style=\"width: 623.75pt; border: none; padding: 0cm 5.4pt 0cm 5.4pt\">");
        //tr.Add($"<p class=\"{mso_hf_end}\" align=\"center\" style=\"text-align: center\">{header_paragraphs[1]}</p>");
        //tr.Add("</td></tr>");

        Word__ = Word__.Replace("__FOOTER__", "mso-footer:url(" + url_hf + ") f1;");
        Word__ = Word__.Replace("__HEADER__", "");
        mso_hf = "<div style=\"mso-element: footer\" id=\"f1\">";
        tr.Add("<p class=MsoNormal align=right style='margin-right:13.0pt;text-align:right;tab-stops:center 227.5pt left 290.9pt'>");/*Formato*/        
        tr.Add("<span style='mso-element:field-begin'></span>PAGE");/*Sigue secuencia de la página*/        
        tr.Add("<span style='mso-element:field-begin'></span>NUMPAGES");/*Sigue la secuenacia de las páginas*/
        tr.Add("<span style='mso-element:field-end'></span></span><![endif]-->");/*Alineado a la derecha*/
      }
      /*** Iniciar ***/
      List<string> fh = Create_FH();
      fh.Add(mso_hf);
      /*** Agregarndo un tabla ***/
      //fh.Add("<table class=\"MsoTableGrid\" cellspacing=\"0\" cellpadding=\"0\" width=\"0\"");
      ///*** Tiene separador ***/
      //string separador;
      //string style_table = "width: 623.75pt;margin-left: -92.15pt;border-collapse: collapse;border: none;mso-yfti-tbllook: 1184;mso-border-insideh: none;mso-border-insidev: none;mso-padding-alt: 0cm 5.4pt 0cm 5.4pt;";

      //if (header.WithSeparator.Item1)
      //{
      //  separador = " border=\"1\" ";
      //  separador += $"style=\"{style_table}mso-border-top-alt: solid windowtext 0.5pt;\">";
      //}
      //else
      //{
      //  separador = " border=\"0\" ";
      //  separador += $"style=\"{style_table}\">";
      //}
      //fh.Add(separador);
      //  if (header.WithImage.Item1)
      //  {
      //    canvas.AddImageAt(ImageDataFactory.Create(header.WithImage.Item2), Margin_Left / 2, y, true);
      //    //document.Add(header.WithImage.Item2.Get_Image());
      //  }
      fh.Add(String.Join("", tr.ToArray()));
      fh.Add("</div>");

      //fh.Add($"</table><p class=\"{mso_hf_end}\"><o:p>&nbsp;</o:p></p></div></body></html>");

      Close_FH(save_hf, String.Join("", fh.ToArray()));
    }

    public List<string> Create_FH()
    {
      List<string> hf = new List<string>()
      {
        "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.0 Transitional//EN\">",
        "<html xmlns:v=\"urn:schemas-microsoft-com:vml\">",
        "<head>",
        "<title>SIRED</title>",
        "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />",
        "</head>",
        "<body>"
      };

      return hf;
    }

    private void Close_FH(string url_hf, string value)
    {    
      FileStream fs = new FileStream(url_hf, FileMode.OpenOrCreate, FileAccess.ReadWrite);
      StreamWriter w = new StreamWriter(fs);

      w.Write(value);
      w.Close();
    }
    #endregion

    #region [Function] Normal -> Styles
    private void Set_Styles()
    {

      string align_center = "center";
      string align_justify = "justify";
      string align_left = "left";
      string align_right = "right";
      //string inter_s = "115%";
      string inter_n = "150%";
      string font_family = "Cambria,sans-serif";
      //string inter_a = "200%";

      string[] normal_style = new string[] {
        ".Normal {",
        $"font-family:{font_family};",
        $"text-align:{align_justify};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", normal_style));

      string[] normal_left_style = new string[] {
        ".Normal_Left {",
        $"font-family:{font_family};",
        $"text-align:{align_left};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", normal_left_style));

      string[] normal_center_style = new string[] {
        ".Normal_Center {",
        $"font-family:{font_family};",
        $"text-align:{align_center};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", normal_center_style));

      string[] normal_right_style = new string[] {
        ".Normal_Right {",
        $"font-family:{font_family};",
        $"text-align:{align_right};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", normal_right_style));

      string[] normal_firmas = new string[]{
        ".Normal_Firmas {",
        $"font-family:{font_family};",
        "font-size:9.0pt;",
        $"text-align:{align_center};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", normal_firmas));

      string[] heading_style = new string[]{
        ".Heading1 {",
        $"font-family:{font_family};",
        "font-weight: bold;",
        "font-size:14.0pt;",
        $"text-align:{align_justify};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", heading_style));

      string[] heading_2_style = new string[]{
        ".Heading2 {",
        $"font-family:{font_family};",
        "font-weight: bold;",
        "font-size:12.0pt;",
        $"text-align:{align_justify};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", heading_2_style));

      string[] heading_3_style = new string[]{
        ".Heading3{ ",
        $"font-family:{font_family};",
        "font-style: italic;",
        "font-size:12.0pt;",
        $"text-align:{align_justify};",
        $"line-height:{inter_n};",
        "margin:0cm;",
        "margin-bottom:.0001pt;",
        "}"
      };
      Styles.Add(String.Join("", heading_3_style));

    }

    public string Style_Apply
    {
      get; set;
    }
    public void Set_Formato_Default()
    {
      Style_Apply = "Normal";
    }
    #endregion

    #region [Function] Name-> Add_Paragraph
    private void Add_Paragraph(string value)
    {
      string p = Get_Paragraph(value);

      Word = p;
    }

    private string Get_Paragraph(string value)
    {
      string[] textos = value.Split('*');
      int i = 0;
      string p = string.Empty;
      //string style = Styles.Find(f => f.Item1 == Style_Apply).Item2;
      //if (style == null || style == string.Empty)
      //  Set_Formato_Default();

      for (i = 0; i < textos.Length; i++)
      {
        string t = textos[i];
        if (i % 2 == 0)
          p += $"<span class=\"{Style_Apply}\">{t}</span>";
        else
        {
          p += $"<B><span class=\"{Style_Apply}\">{t}</span></B>";
        }
      }

      return $"<div class=\"{Style_Apply}\">{p}</div>";
    }
    #endregion

    #region [Function] Add_Table
    private void Add_Table(PDFFlowable_Table value)
    {
      string anchoTabla = "width=\"100%\"";
      string tabla = string.Empty;

      //string borde = ";border-collapse:collapse; mso-border-alt:solid windowtext 1.0pt; mso-padding-alt:0cm 5.4pt 0cm 5.4pt";
      tabla += "<div align=\"justify\">";
      tabla += $"<table border=0 style=\"mso-table-layout-alt:fixed\" {anchoTabla}>";
      //tabla.conBorde ? 1 : 0, (tabla.conBorde ? borde : ""), anchoTabla); ; ;

      foreach (var fila in value.Filas)
      {
        List<string> cells = new List<string>();

        cells.Add("<tr>");
        foreach (var item in fila)
        {
          int border_top = item.Borders.Item1;
          int border_right = item.Borders.Item2;
          int border_bottom = item.Borders.Item3;
          int border_left = item.Borders.Item4;
          string border_color = item.Borders.Item5;

          string Border_Top = $"border-top:{Borders(border_top, border_color)}";
          string Border_Bottom = $"border-bottom:{Borders(border_bottom, border_color)}";
          string Border_Right = $"border-right:{Borders(border_right, border_color)}";
          string Border_Left = $"border-left:{Borders(border_left, border_color)}";
          //Borde = string.Format(";;;;", Border_Top, Border_Bottom, Border_Right, Border_Left);

          string cell_Style = $"\"background:{item.Color};vertical-align:middle;{Border_Top}{Border_Bottom}{Border_Right}{Border_Left}\"";
          Style_Apply = item.Style_Apply;//.Insert(item.Style_Apply.Length - 1, cell_Style);

          cells.Add($"<td style={cell_Style}>{Get_Paragraph(item.Value)}</td>");
        }
        cells.Add("</tr>");

        tabla += String.Join("", cells.ToArray());
      }
      tabla += "</table></div>";
      Word = tabla;
    }
    private string Borders(int border_size, string border_color)
        => border_size <= 0 ?
        "none;" :
        $"solid windowtext {border_size};border-color:{border_color};";

    //private void Set_Table_CSV(List<List<string>> value)
    //{
    //  //fila
    //  foreach (List<string> fila in value)
    //  {
    //    //celdas
    //    string row = string.Empty;
    //    foreach (string cell in fila)
    //    {
    //      row = $"{row},{cell}";
    //    }
    //    Sbuilder.AppendLine(row);
    //  }
    //}
    #endregion

    #region [Function] Name-> Close
    public void Close()
    {
      FileStream fs = new FileStream(Save_Path, FileMode.OpenOrCreate, FileAccess.ReadWrite);
      StreamWriter w = new StreamWriter(fs);

      Word = ("</div>");
      Word = ("</body>");
      Word = ("</html>");
      StringBuilder HTML = new StringBuilder();
      HTML.Append(Word);
      w.Write(HTML.ToString());
      w.Close();
    }
    #endregion
  }
}
