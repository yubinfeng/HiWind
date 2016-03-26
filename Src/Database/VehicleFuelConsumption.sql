
CREATE TABLE [dbo].[VehicleFuelConsumption]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY,
	[CreateDate] DATETIME NULL, 
    [UpdateDate] DATETIME NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [UpDateId] VARCHAR(50) NULL, 
    [DeleteTag] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [FuelConsumptionDate] DATE NULL, 
    [Mileage] DECIMAL(18, 3) NULL, 
    [MileageMonth] DECIMAL(18, 3) NULL, 
    [FuelConsumptionMonth] DECIMAL(18, 3) NULL, 
    [FuelConsumptionHundred] DECIMAL(18, 3) NULL, 
    [Quota] DECIMAL(18, 3) NULL, 
    [Saving] DECIMAL(18, 3) NULL, 
    [Driver] VARCHAR(50) NULL, 
    [Registrant] VARCHAR(50) NULL, 
    [VehicleId] VARCHAR(50) NULL
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'UpDateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'DeleteTag'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'时间 （年/月）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = 'FuelConsumptionDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'累计行驶 里程（km）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'Mileage'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'本月行驶 里程（km）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'MileageMonth'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'本月燃油 消耗（升',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'FuelConsumptionMonth'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'百车公里实际消耗量',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'FuelConsumptionHundred'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车型燃油消耗定额',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'Quota'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'节油/超耗',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'Saving'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'司机姓名',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'Driver'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'记录人签名',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'Registrant'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleFuelConsumption',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'