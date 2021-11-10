using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
  public partial class SIRED_Entities : DbContext
  {
    public SIRED_Entities(string nameOrConnectionString)
      : base(nameOrConnectionString)
    { }
  }
}
