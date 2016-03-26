
CREATE TABLE [dbo].[SysPrintTemplate](
	[ID] [varchar](50) NOT NULL,
	[Name] [varchar](50) NULL,
	[Type] [varchar](20) NOT NULL,
	[Model] VARCHAR(MAX) NULL,
	[PageWidth] [varchar](20) NULL,
	[Direction] VARCHAR(20) NULL,
	[IsUesfull] VARCHAR(10) NULL,
	[IsPrint] VARCHAR(10) NULL,
	[BackgroundImage] [varchar](200) NULL,
	[KeyValue] VARCHAR(MAX) NULL,
	[CreateDate] [datetime] NULL,
	[UpdateDate] [datetime] NULL,
	[DelFlg] [bit] NULL,
	[UpdateId] VARCHAR(50) NULL,
	[OrgId] [varchar](50) NULL,
	[PageHeight] INT NULL,
 [CreateId] VARCHAR(50) NULL, 
    CONSTRAINT [PK_SysPrintTemplate] PRIMARY KEY ([ID]) 
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'创建日期' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SysPrintTemplate', @level2type=N'COLUMN',@level2name=N'CreateDate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'更新日期' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SysPrintTemplate', @level2type=N'COLUMN',@level2name=N'UpdateDate'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'删除标记' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'SysPrintTemplate', @level2type=N'COLUMN',@level2name=N'DelFlg'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'ID'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'打印方向',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'Direction'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'页面宽',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'PageWidth'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'页面高',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'PageHeight'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'是否启用',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'IsUesfull'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'是否直接打印（需正式版）',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'IsPrint'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'背景图片',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'BackgroundImage'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'键值',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'KeyValue'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'模板',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'Model'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'类型',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'Type'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'模板名称',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'Name'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'更新人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'UpdateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'创建人',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'CreateId'
GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'机构编号',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SysPrintTemplate',
    @level2type = N'COLUMN',
    @level2name = N'OrgId'