using iText.IO.Font;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Kernel.Font;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Properties;
using PDFSharpFlow.PDFFlowable_Classes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace PDFSharpFlow
{
  public class PDFFlowable
  {
    #region [Propiedades]
    private readonly PdfDocument pdf;
    private readonly Document document;
    private readonly List<(string, Style)> Styles = new List<(string, Style)>();

    public void LineBreak(int breaks = 1) { for (int i = 0; i < breaks; i++) Add = ""; }
    public string Save_Path_Name { get; }
    private Border Borders(int border_size, string border_color)
        => border_size < 0 ?
        Border.NO_BORDER :
        new SolidBorder(Get_Color(border_color), border_size);
    private readonly float LetterHeight = 792;
    private readonly float Margin_Left = 80;
    #endregion

    #region [Constructor]
    public PDFFlowable(string _save_path_name_)
    {
      Save_Path_Name = _save_path_name_;
      pdf = new PdfDocument(new PdfWriter(Save_Path_Name));
      Rectangle page_size = new Rectangle(612, LetterHeight);
      document = new Document(pdf, new PageSize(page_size));
      document.SetMargins(90f, 80f, 80f, Margin_Left);

      //pdf.Info.Title = descripcion;
      Set_Formato_Default();
      Set_Styles();
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
        else if (value is PDFFlowable_Image image)
        {
          Add_Image(image);
        }
        else if (value is PDFFlowable_Firmas firmas)
        {
          Add_Firmas(firmas);
        }
      }
    }
    #endregion
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
            string f = list[i].Replace(".-", "\n");
            if (newLine == 1)
            {
              fila.Add(new PDFFlowable_Cell() { Value = "", Borders = (-1, -1, -1, -1, firmas.Get_Border_Color()) });
              separator.Add(new PDFFlowable_Cell() { Value = "", Borders = (-1, -1, -1, -1, firmas.Get_Border_Color()) });
            }
            fila.Add(new PDFFlowable_Cell() { Value = f, Style_Apply = "Normal_Firmas", Borders = (1, -1, -1, -1, firmas.Get_Border_Color()) });
            separator.Add(new PDFFlowable_Cell() { Value = "\n", Borders = (-1, -1, -1, -1, firmas.Get_Border_Color()) });

            i++;
          }
        }

        value.Filas.Add(fila);
        value.Filas.Add(separator);
      }

      LineBreak(9);
      Add_Table(value);
    }

    #region [Function] Name-> Add_Image
    private void Add_Image(PDFFlowable_Image image)
    {
      document.Add(image.Get_Image());
    }
    #endregion

    #region [Function] Name-> Add_Header_Footer
    private void Add_Header(PDFFlowable_Header header)
    {

      for (int i = 1; i <= pdf.GetNumberOfPages(); i++)
      {
        Rectangle pageSize = pdf.GetPage(i).GetPageSize();
        float x = header.IsHeader ? pageSize.GetWidth() - 40 : pageSize.GetWidth() / 2;
        float y = header.IsHeader ? pageSize.GetTop() - 60 : pageSize.GetBottom() + 60;

        PdfCanvas canvas = new PdfCanvas(pdf.GetPage(i));
        if (header.WithSeparator.Item1)
        {
          float y2 = header.IsHeader ? pageSize.GetTop() - 80 : pageSize.GetBottom() + 80;
          canvas
            .SetStrokeColor(Get_Color(header.WithSeparator.Item2))
            .SetLineWidth(1)
            .MoveTo(0, y2)
            .LineTo(pageSize.GetRight(), y2)
            .ClosePathStroke();
        }
        if (header.WithImage.Item1)
        {
          canvas.AddImageAt(ImageDataFactory.Create(header.WithImage.Item2), Margin_Left / 2, y, true);
          //document.Add(header.WithImage.Item2.Get_Image());
        }
        for (int j = 0; j < header.Textos.Count; j++)
        {
          var item = header.Textos[j];
          Paragraph header_paragraph = new Paragraph(item)
            .SetFontSize(10);
          y = header.IsHeader ? y + (j * 10) : y - (j * 10);
          document.ShowTextAligned(header_paragraph,
            x,
            y,
            i,
            header.IsHeader ? TextAlignment.RIGHT : TextAlignment.CENTER,
            VerticalAlignment.BOTTOM,
            0
            );

        }

      }

    }
    #endregion

    #region [Function] Name-> Add_Table
    private void Add_Table(PDFFlowable_Table value)
    {
      Table table = new Table(UnitValue.CreatePercentArray(value.Filas.ElementAt(0).Count)).UseAllAvailableWidth();

      foreach (var fila in value.Filas)
      {
        foreach (var item in fila)
        {
          Color color = Get_Color(item.Color);
          Style_Apply = item.Style_Apply;
          Cell cell = new Cell().Add(Get_Paragraph(item.Value));
          cell.SetBackgroundColor(color);


          int border_top = item.Borders.Item1;
          int border_right = item.Borders.Item2;
          int border_bottom = item.Borders.Item3;
          int border_left = item.Borders.Item4;
          string border_color = item.Borders.Item5;

          cell.SetBorderTop(Borders(border_top, border_color));
          cell.SetBorderRight(Borders(border_right, border_color));
          cell.SetBorderBottom(Borders(border_bottom, border_color));
          cell.SetBorderLeft(Borders(border_left, border_color));

          if (item.Bold)
            cell.SetBold();

          table.AddCell(cell);
        }
      }

      document.Add(table);
    }
    #endregion

    #region [Function] Name-> Get_Color
    private Color Get_Color(string value)
    {
      string pattern = @"([a-f0-9]{2})";
      Regex rg = new Regex(pattern);

      Color color;
      MatchCollection hex6 = rg.Matches(value.ToLower());
      int r = int.Parse(hex6[0].Value, System.Globalization.NumberStyles.HexNumber);
      int g = int.Parse(hex6[1].Value, System.Globalization.NumberStyles.HexNumber);
      int b = int.Parse(hex6[2].Value, System.Globalization.NumberStyles.HexNumber);
      color = new DeviceRgb(r, g, b);
      return color;
    }
    #endregion

    #region [Function] Name-> Set_Formato_Default
    public void Set_Formato_Default()
    {
      Style_Apply = "Normal";
    }
    #endregion

    #region [Function] Normal -> Styles
    private void Set_Styles()
    {
      Style normal_style = new Style();
      normal_style.SetTextAlignment(iText.Layout.Properties.TextAlignment.JUSTIFIED);
      Styles.Add(("Normal", normal_style));

      Style normal_left_style = new Style();
      normal_left_style.SetTextAlignment(iText.Layout.Properties.TextAlignment.LEFT);
      Styles.Add(("Normal_Left", normal_left_style));

      Style normal_center_style = new Style();
      normal_center_style.SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
      Styles.Add(("Normal_Center", normal_center_style));

      Style normal_right_style = new Style();
      normal_right_style.SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT);
      Styles.Add(("Normal_Right", normal_right_style));

      Style normal_firmas = new Style();
      normal_firmas.SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
      normal_firmas.SetFontSize(9);
      Styles.Add(("Normal_Firmas", normal_firmas));

      Style heading_style = new Style();
      heading_style.SetFontSize(14);
      heading_style.SetBold();
      Styles.Add(("Heading1", heading_style));

      Style heading_2_style = new Style();
      heading_2_style.SetFontSize(12);
      heading_2_style.SetBold();
      Styles.Add(("Heading2", heading_2_style));

      Style heading_3_style = new Style();
      heading_3_style.SetFontSize(12);
      heading_3_style.SetItalic();
      Styles.Add(("Heading3", heading_3_style));

    }

    public string Style_Apply
    {
      get; set;
    }
    #endregion

    #region [Function] Name-> Add_Paragraph
    private void Add_Paragraph(string value)
    {
      Paragraph p = Get_Paragraph(value);

      _ = document.Add(p);
    }

    private Paragraph Get_Paragraph(string value)
    {
      string[] textos = value.Split('*');
      int i = 0;
      Paragraph p = new Paragraph();
      for (i = 0; i < textos.Length; i++)
      {
        string t = textos[i];
        if (i % 2 == 0)
          p.Add(t);
        else
        {
          Text tf = new Text(t).SetBold();
          p.Add(tf);
        }
      }
      Style style = Styles.Find(f => f.Item1 == Style_Apply).Item2;
      if (style != null)
        p.AddStyle(style);

      return p;
    }
    #endregion

    #region [Function] Name-> Close
    public void Close()
    {
      document.Close();
    }
    #endregion

  }
}
