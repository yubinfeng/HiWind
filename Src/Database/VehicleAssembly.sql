
CREATE TABLE [dbo].[VehicleAssembly]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY,
	[CreateDate] DATETIME NULL, 
    [UpdateDate] DATETIME NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [UpDateId] VARCHAR(50) NULL, 
    [DeleteTag] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [ChangeDate] DATE NULL, 
    [ChangeBody] VARCHAR(50) NULL, 
    [ChanageCompany] VARCHAR(50) NULL, 
    [Registrant] VARCHAR(50) NULL, 
    [VehicleId] VARCHAR(50) NULL
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'UpDateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'DeleteTag'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更换日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'ChangeDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更换主要部件名称、型号（规格）及厂名',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'ChangeBody'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'实施部件更换单位',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'ChanageCompany'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'登记人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'Registrant'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAssembly',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'