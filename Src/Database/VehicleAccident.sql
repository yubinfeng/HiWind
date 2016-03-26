

CREATE TABLE [dbo].[VehicleAccident]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY,
	[CreateDate] DATETIME NULL, 
    [UpdateDate] DATETIME NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [UpDateId] VARCHAR(50) NULL, 
    [DeleteTag] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [Registrant] VARCHAR(50) NULL, 
    [VehicleId] VARCHAR(50) NULL, 
    [AccidentDate] DATE NULL, 
    [AccidentPlace] VARCHAR(100) NULL, 
    [AccidentProperty] VARCHAR(100) NULL, 
    [AccidentResponsibility ] VARCHAR(100) NULL, 
    [AccidentType] VARCHAR(100) NULL, 
    [AccidentLose] DECIMAL(18, 2) NULL
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'UpDateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'DeleteTag'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO

GO

GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'登记人签名',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'Registrant'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'事故发生日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'AccidentDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'事故发生地点',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'AccidentPlace'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'事故性质',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'AccidentProperty'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'事故责任',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'AccidentResponsibility '
GO

GO

EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'事故种类及车辆损坏情况',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'AccidentType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'企业直接经济',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleAccident',
    @level2type = N'COLUMN',
    @level2name = N'AccidentLose'