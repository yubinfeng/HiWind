
CREATE TABLE [dbo].[VehicleRepair]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY,
	[CreateDate] DATETIME NULL, 
    [UpdateDate] DATETIME NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [UpDateId] VARCHAR(50) NULL, 
    [DeleteTag] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [RepairType] VARCHAR(50) NULL, 
    [RepairDate] DATE NULL, 
    [RepairContent] VARCHAR(200) NULL, 
    [RepairCompany] VARCHAR(50) NULL, 
    [CertificateNo] VARCHAR(50) NULL, 
    [Register] VARCHAR(50) NULL, 
    [VehicleId] VARCHAR(50) NULL
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'UpDateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'DeleteTag'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修类别',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'RepairType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'RepairDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修内容',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'RepairContent'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'维修单位',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'RepairCompany'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'竣工合格证号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'CertificateNo'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'登记人签名',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'Register'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleRepair',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'