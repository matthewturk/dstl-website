

    export enum AggregationType {
        Sum = 'sum',
        Mean = 'mean',
        Average = 'average',
        Count = 'count',
        Min = 'min',
        Max = 'max',
        StdDev = 'stddev',
        Variance = 'variance',
        Mode = 'mode',
        Median = 'median',
        Quantile = 'quantile',
    }

// Plain-English names shown in the right-click menu (keep node titles in sync with these)
export const nodeInfo: Record<string, { title: string; description: string }> = {
	uploadNode: { title: 'Upload Data', description: 'Load a CSV spreadsheet from your computer' },
	propertiesNode: {
		title: 'Column Summary',
		description: 'Smallest, largest, average and unique values for each column'
	},
	spreadsheetNode: { title: 'Data Table', description: 'Browse, search and filter your rows' },
	sortNode: { title: 'Sort Rows', description: 'Put rows in order' },
	aggregateNode: {
		title: 'Group & Summarize',
		description: 'Combine rows by category, then total or average them'
	},
	graphWrapperNode: { title: 'Chart', description: 'Draw a bar, line or scatter chart' }
};
