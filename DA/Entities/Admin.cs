using System;
using System.Collections.Generic;

namespace DA.Entities;

public partial class Admin
{
    public Guid Id { get; set; }

    public virtual User IdNavigation { get; set; } = null!;
}
