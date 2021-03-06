
export const emptyState = (): SnowflakeAppState => {
    return {
        name: '',
        title: '',
        milestoneByTrack: {
            'LEADERSHIP': 0,
            'EXECUTION': 0,
            'PERSONAL_EXCELLENCE': 0,
            'TECHNICAL_EXCELLENCE': 0,
            'TECHNICAL_MANAGEMENT' : 0, 
            'EXECUTION_MANAGEMENT' : 0, 
            'LEADERSHIP_MANAGEMENT' : 0, 
            'PERSONAL_MANAGEMENT': 0
        },
        focusedTrackId: 'TECHNICAL_EXCELLENCE'
    }
};

export const defaultState = (): SnowflakeAppState => {
    return {
        name: '',
        title: 'Software Engineer - IC1',
        milestoneByTrack: {
            'LEADERSHIP': 0,
            'EXECUTION': 0,
            'PERSONAL_EXCELLENCE': 0,
            'TECHNICAL_EXCELLENCE': 0,
            'TECHNICAL_MANAGEMENT' : 0, 
            'EXECUTION_MANAGEMENT' : 0, 
            'LEADERSHIP_MANAGEMENT' : 0, 
            'PERSONAL_MANAGEMENT': 0
        },
        focusedTrackId: 'TECHNICAL_EXCELLENCE'
    }
};
