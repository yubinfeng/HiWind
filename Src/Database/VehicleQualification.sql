
CREATE TABLE [dbo].[VehicleQualification]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY, 
    [CreateDate] DATETIME NULL, 
    [UpdateDate] DATETIME NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [UpDateId] VARCHAR(50) NULL, 
    [DeleteTag] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [VehicleId] VARCHAR(50) NULL, 
    [Mender] VARCHAR(50) NULL, 
    [LicensePlate ] VARCHAR(50) NULL, 
    [VehicleType] VARCHAR(50) NULL, 
    [EngineType] VARCHAR(50) NULL, 
    [ChassisModel] VARCHAR(50) NULL, 
    [RepairType] VARCHAR(50) NULL, 
    [RepairContractsNo] VARCHAR(50) NULL, 
    [FactoryMileage] DECIMAL(18, 3) NULL, 
    [QualityInspector] VARCHAR(50) NULL, 
    [RepairCompany] VARCHAR(50) NULL, 
    [RepairStartDate] DATE NULL, 
    [RepairFinishDate] DATE NULL, 
    [PickUpPerson] VARCHAR(50) NULL, 
    [PickUpDate] DATE NULL, 
    [TotalMileage ] DECIMAL(18, 3) NULL, 
    [TotalDay] INT NULL, 
    [ReRepairCount] INT NULL, 
    [ReRepairObject] VARCHAR(50) NULL, 
    [ReRepairDate] DATE NULL, 
    [ReRepairFinishDate] DATE NULL, 
    [ReRepairPerson] VARCHAR(50) NULL, 
    [ReRepairInspector] VARCHAR(50) NULL, 
    [RepairInvoiceNo] NCHAR(10) NULL
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'Id'
GO

GO

GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'UpDateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'DeleteTag'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'托修方',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'Mender'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌号码',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'LicensePlate '
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车型',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'VehicleType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'发动机型号/编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'EngineType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'底盘（车身）号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'ChassisModel'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修类别',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'RepairType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修合同编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'RepairContractsNo'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'出厂里程表示值',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'FactoryMileage'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N' 质量检验员',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'QualityInspector'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'承修单位',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'RepairCompany'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'进厂日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = 'RepairStartDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'出厂日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'RepairFinishDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'托修方接车人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'PickUpPerson'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'接车日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'PickUpDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'行驶里程',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'TotalMileage '
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'行驶天数',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'TotalDay'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'返修次数',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = 'ReRepairCount'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'返修项目',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = 'ReRepairObject'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'返修竣工日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = 'ReRepairFinishDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'返修日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'ReRepairDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'返修送修人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'ReRepairPerson'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'返修质检员',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'ReRepairInspector'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修发票号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleQualification',
    @level2type = N'COLUMN',
    @level2name = N'RepairInvoiceNo'