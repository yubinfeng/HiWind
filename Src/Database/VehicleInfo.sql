CREATE TABLE [dbo].[VehicleInfo]
(
	[Id] VARCHAR(50) NOT NULL , 
    [Company] VARCHAR(50) NULL, 
    [CompanyChangeFirst] VARCHAR(50) NULL, 
    [CompanyChangeSecond] VARCHAR(50) NULL, 
    [CompanyChangeThird] VARCHAR(50) NULL, 
    [LicensePlate] VARCHAR(10) NULL, 
    [LicensePlateChangeFirst] VARCHAR(10) NULL, 
    [LicensePlateChangeSecond] VARCHAR(10) NULL, 
    [LicensePlateChangeThird] VARCHAR(10) NULL, 
    [LicensePlateColer] VARCHAR(10) NULL, 
    [MeterModel] VARCHAR(20) NULL, 
    [MeterNumber] VARCHAR(20) NULL, 
    [ManageModel] VARCHAR(50) NULL, 
    [VehicleType] VARCHAR(20) NULL, 
    [BusinessScope ] VARCHAR(100) NULL, 
    [FilingTime] DATE NULL, 
    [VehicleSource] VARCHAR(50) NULL, 
    [CompanyChangeDateFirst] DATE NULL, 
    [CompanyChangeDateSecond] DATE NULL, 
    [CompanyChangeDateThird] DATE NULL, 
    [LicensePlateChangeDateFirst] DATE NULL, 
    [LicensePlateChangeDateSecond] DATE NULL, 
    [LicensePlateChangeDateThird] DATE NULL, 
    [RegistrationDate] DATE NULL, 
    [TransportCardNumber ] VARCHAR(20) NULL, 
    [IssueDate] DATE NULL, 
    [NumberChangeFirst] VARCHAR(20) NULL, 
    [NumberChangeSecond] VARCHAR(20) NULL, 
    [NumberChangeThird] VARCHAR(20) NULL, 
    [NumberChangeDateFirst] DATE NULL, 
    [NumberChangeDateSecond] DATE NULL, 
    [NumberChangeDateThird] DATE NULL, 
    [VehiclePhoto] VARCHAR(50) NULL, 
    [CreateId] VARCHAR(20) NULL, 
    [CreateDate] DATETIME NULL, 
    [UpdateId] VARCHAR(20) NULL, 
    [UpdateDate] DATETIME NULL, 
    [DelFlg] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    CONSTRAINT [PK_VehicleInfo] PRIMARY KEY ([Id])
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'出租车计价器型号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'MeterModel'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌颜色',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'LicensePlateColer'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌变更3',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'LicensePlateChangeThird'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌变更2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'LicensePlateChangeSecond'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌变更1',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'LicensePlateChangeFirst'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌号码',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'LicensePlate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位变更3',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'CompanyChangeThird'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位变更2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'CompanyChangeSecond'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位变更1',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'CompanyChangeFirst'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位全名',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'Company'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'Id'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'出租车计价器编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'MeterNumber'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'经营组织方式',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'ManageModel'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆类别',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'VehicleType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆经营范围',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'BusinessScope '
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'建档时间',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'FilingTime'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆来源',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'VehicleSource'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位变更日期1',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'CompanyChangeDateFirst'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位变更日期2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'CompanyChangeDateSecond'
GO

GO

EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'单位变更日期3',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'CompanyChangeDateThird'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌变更日期2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'LicensePlateChangeDateFirst'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌变更日期2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'LicensePlateChangeDateSecond'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车牌变更日期3',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'LicensePlateChangeDateThird'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'注册日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'RegistrationDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'运输证号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'TransportCardNumber '
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'发证日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'IssueDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号变更1',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'NumberChangeFirst'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号变更2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'NumberChangeSecond'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号变更3',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'NumberChangeThird'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号变更日期1',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'NumberChangeDateFirst'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号变更日期2',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'NumberChangeDateSecond'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号变更日期3',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'NumberChangeDateThird'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆照片',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'VehiclePhoto'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'OrgId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'DelFlg'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'UpdateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = 'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleInfo',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'