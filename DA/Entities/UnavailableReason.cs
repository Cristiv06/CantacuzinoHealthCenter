﻿// <auto-generated> This file has been auto generated by EF Core Power Tools. </auto-generated>
#nullable enable
using System;
using System.Collections.Generic;

namespace DA.Entities;

public partial class UnavailableReason
{
    public int Id { get; set; }

    public string? Reason { get; set; }

    public virtual ICollection<UnavailablePeriod> UnavailablePeriods { get; set; } = new List<UnavailablePeriod>();
}