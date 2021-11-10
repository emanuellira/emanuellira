using api.Models.Reportes;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace api.Models.Data
{
    /// <summary>
    /// Métodos para crear SQL Queries,
    /// [# version: 7.5.11 #]
    /// </summary>
    public class SQL_Query_AND_Commands
    {
        private readonly string tabla;
        private readonly List<SqlParameter> sql_parameters = new List<SqlParameter>();

        public SQL_Query_AND_Commands(string _tabla_)
        {
            tabla = _tabla_;
        }

        public string Create_Where(Reporte reporte)
        {
            //Ejemplo de parámetros en el sql_pipe = "IDEvento|0|number|IDSector|8|number";
            string[] data = reporte.Descripcion.Split('|');
            /*
            0 data[0] = "IDEvento" -----> El nombre del campo en base de datos
            1 data[1] = 0 -----> El valor del campo
            2 data[2] = number -----> El tipo de dato (int, string, bool, etc.)
            */
            string where = "WHERE ";
            if (data.Length > 2)
            {
                for (int i = 0; i < data.Length; i += 5)
                {
                    //int a = 0;
                    int i1 = i + 1;
                    int i2 = i + 2;
                    int i3 = i + 3;
                    string sql_param = data[i1];
                    if (i < 2)
                    {
                        where += $"IDUsuario = {reporte.IDUsuario} AND ({data[i]} = @{data[i]}{i2}";
                    }
                    else
                    {
                        where += $" {data[i3]} {data[i]} = @{data[i]}{i2}";
                    }
                    sql_parameters.Add(new SqlParameter($"@{data[i]}{i2}", sql_param));
                }
            }
            where += ")";
            return $"SELECT * FROM {tabla} {where}";
        }

        public SqlParameter[] Get_Parameters() => sql_parameters.ToArray();

    }
}
