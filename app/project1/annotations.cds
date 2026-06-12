using AdminService as service from '../../srv/admin-service';

annotate service.Books with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            { $Type : 'UI.DataField', Label : 'title', Value : title },
            { $Type : 'UI.DataField', Label : 'genre', Value : genre },
            { $Type : 'UI.DataField', Label : 'price', Value : price },
            { $Type : 'UI.DataField', Label : 'rating', Value : rating },
            { $Type : 'UI.DataField', Label : 'stock', Value : stock },
            { $Type : 'UI.DataField', Label : 'isbn', Value : isbn },
            { $Type : 'UI.DataField', Label : 'publishDate', Value : publishDate }
        ],
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],

    UI.LineItem : [
        { $Type : 'UI.DataField', Label : '{i18n>TitleName}', Value : title },
        { $Type : 'UI.DataField', Label : 'genre', Value : genre },
        { $Type : 'UI.DataField', Label : 'price', Value : price },
        { $Type : 'UI.DataField', Label : 'rating', Value : rating },

        // ✅ CRITICALITY ADDED HERE
        {
            $Type : 'UI.DataField',
            Label : 'stock',
            Value : stock,
            Criticality : stockCriticality
        },

        { $Type : 'UI.DataField', Value : isbn, Label : 'isbn' },
        { $Type : 'UI.DataField', Value : publishDate, Label : 'publishDate' },
        { $Type : 'UI.DataField', Value : author.country, Label : 'country' },
        { $Type : 'UI.DataField', Value : author.ID, Label : '{i18n>IdNumber}' },
        { $Type : 'UI.DataField', Value : author.name, Label : 'name' }
    ],
);

annotate service.Books with {
    author @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'Authors',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : author_ID,
                ValueListProperty : 'ID'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'name'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'country'
            }
        ]
    }
};
