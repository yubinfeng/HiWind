CREATE TABLE [dbo].[VehicleParameters]
(
	[Id] VARCHAR(50) NOT NULL PRIMARY KEY, 
    [VehicleId] VARCHAR(50) NULL, 
    [VehicleType] VARCHAR(50) NULL, 
    [Brand] VARCHAR(50) NULL, 
    [ModelNumber] VARCHAR(50) NULL, 
    [ManufactureDate] DATE NULL, 
    [ProducingArea] VARCHAR(50) NULL, 
    [FrameNumber] VARCHAR(50) NULL, 
    [ChassisModel] VARCHAR(50) NULL, 
    [TypeGrade] VARCHAR(50) NULL, 
    [TypeGradeChange] VARCHAR(50) NULL, 
    [VehicleLength] DECIMAL NULL, 
    [VehicleWidth] DECIMAL NULL, 
    [VehicleHeight] DECIMAL NULL, 
    [TotalMass] DECIMAL NULL, 
    [Seat] VARCHAR(50) NULL, 
    [Sleeper] VARCHAR(50) NULL, 
    [ApprovedLoad] DECIMAL NULL, 
    [ApprovedCrew] INT NULL, 
    [TractionMass] DECIMAL NULL, 
    [DrivingMode] VARCHAR(50) NULL, 
    [EngineType] VARCHAR(50) NULL, 
    [EnginePower] VARCHAR(50) NULL, 
    [FuelType] VARCHAR(50) NULL, 
    [EngineNumber] VARCHAR(50) NULL, 
    [EngineDisplacement] VARCHAR(50) NULL, 
    [EffluentStandard] VARCHAR(50) NULL, 
    [TyreType] VARCHAR(50) NULL, 
    [LightSystem] VARCHAR(50) NULL, 
    [TransmissionType] VARCHAR(50) NULL, 
    [AirConditioner] VARCHAR(50) NULL, 
    [SteeringDevice] VARCHAR(50) NULL, 
    [BrakingMode] VARCHAR(50) NULL, 
    [RearOverhangFront] VARCHAR(50) NULL, 
    [CreateId] VARCHAR(50) NULL, 
    [CreateDate] DATETIME NULL, 
    [UpdateId] VARCHAR(50) NULL, 
    [UpdateDate] DATETIME NULL, 
    [DelFlg] BIT NULL, 
    [OrgId] VARCHAR(50) NULL, 
    [RearOverhangBack] VARCHAR(50) NULL, 
    [AirbagsFront] VARCHAR(50) NULL, 
    [AirbagsBack] VARCHAR(50) NULL, 
    [LeafSpringNmberFront] INT NULL, 
    [LeafSpringNmberBack] INT NULL, 
    [InnerDimensions] DECIMAL NULL, 
    [BoxCount] INT NULL, 
    [EffectiveVolume] DECIMAL NULL, 
    [OtherConfigLubrication] VARCHAR(20) NULL, 
    [OtherConfigGps] VARCHAR(20) NULL, 
    [OtherConfigGrapher] VARCHAR(20) NULL, 
    [OtherConfigRetarder] VARCHAR(20) NULL, 
    [OtherConfigCan] VARCHAR(20) NULL, 
    [OtherConfigDiversionDevice] VARCHAR(20) NULL, 
    [OtherConfigFireUnit] VARCHAR(20) NULL, 
    [SpecialVehicleSafeguard] VARCHAR(20) NULL, 
    [SpecialVehicleEnvironmental] VARCHAR(20) NULL, 
    [SpecialVehicleFire] VARCHAR(20) NULL, 
    [SpecialVehicleCertificate] VARCHAR(20) NULL 
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'Id'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'VehicleId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'车辆类型',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'VehicleType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'厂牌',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'Brand'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'型号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'ModelNumber'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'出厂日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'ManufactureDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'产地',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'ProducingArea'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'VIN(或车架)号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'FrameNumber'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'底盘型号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'ChassisModel'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'类型等级',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'TypeGrade'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'类型等级(变更)',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'TypeGradeChange'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'长',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'VehicleLength'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'宽',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'VehicleWidth'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'高',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'VehicleHeight'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'总质量',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'TotalMass'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'座位',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'Seat'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'卧铺',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'Sleeper'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'核定载质量',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'ApprovedLoad'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'核定乘员数',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'ApprovedCrew'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'牵引总质量',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'TractionMass'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'驱动形式',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'DrivingMode'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'发动机型号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'EngineType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'发动机功率',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'EnginePower'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'燃料种类',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'FuelType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'发动机号码',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'EngineNumber'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'发动机排量',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'EngineDisplacement'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'排放标准',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'EffluentStandard'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'轮胎数与种类',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'TyreType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'前照灯制式',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'LightSystem'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'变速器类型',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'TransmissionType'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'空调器',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'AirConditioner'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'转向器',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'SteeringDevice'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'行车制动形式',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'BrakingMode'
GO

GO

GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'删除标识',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'DelFlg'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'UpdateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'UpdateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建日期',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'CreateDate'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO


GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'悬挂形式（后轮）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'RearOverhangBack'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'悬挂形式（前轮）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'RearOverhangFront'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'气囊（前）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'AirbagsFront'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'气囊（后）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'AirbagsBack'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N' 板簧数（前）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = 'LeafSpringNmberFront'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N' 板簧数（后）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'LeafSpringNmberBack'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'货厢内部尺寸',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'InnerDimensions'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'集装箱种类/数量',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'BoxCount'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'罐车有效容积',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'EffectiveVolume'
GO

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（底盘自动润滑）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigLubrication'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（GPS）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigGps'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（行车记录仪）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigGrapher'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（缓速器）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigRetarder'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（CAN总线）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigCan'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（导流装置）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigDiversionDevice'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'其他配置（灭火装置）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'OtherConfigFireUnit'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'专用车辆（安全防护设施）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'SpecialVehicleSafeguard'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'专用车辆（环境保护设施）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'SpecialVehicleEnvironmental'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'专用车辆（消防设施）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'SpecialVehicleFire'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'专用车辆（罐体质检合格证）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'VehicleParameters',
    @level2type = N'COLUMN',
    @level2name = N'SpecialVehicleCertificate'