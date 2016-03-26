CREATE TABLE [dbo].[VehicleExamined]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY,
	[CreateDate] DATETIME NULL, 
    [UpdateDate] DATETIME NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [UpDateId] VARCHAR(50) NULL, 
    [DeleteTag] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [VehicleId] VARCHAR(50) NULL, 
    [Year] INT NULL, 
    [Detection] VARCHAR(100) NULL, 
    [Repair] VARCHAR(100) NULL, 
    [Info] VARCHAR(100) NULL, 
    [Accident] VARCHAR(100) NULL, 
    [Insurance] VARCHAR(100) NULL, 
    [Claim] VARCHAR(100) NULL
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'UpDateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'DeleteTag'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'审验年度',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Year'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'检测审定',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Detection'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆定期维护',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Repair'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆档案管理',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Info'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆违法处罚',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = 'Accident'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆保险/规费',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Insurance'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆经营要求',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleExamined',
    @level2type = N'COLUMN',
    @level2name = N'Claim'