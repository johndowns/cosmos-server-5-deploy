import {Mock, It, Times, ExpectedGetPropertyExpression, MockBehavior} from 'moq.ts';
import {getGroupedOrdersImpl} from '../src/getGroupedOrders'

describe("getGroupedOrdersImpl", function() {
    it("should return an empty array", function() {
        // arrange
        var collectionObject = null;
        
        // act
        var result = getGroupedOrdersImpl([], collectionObject);

        // assert
        expect(result.length).toBe(0);
    });

    it("should execute a query against the collection", function() {
        // arrange
        const mock = new Mock<ICollection>()
            .setup(instance => instance.getSelfLink)
            .returns(() => { return "self-link"; })

            .setup(instance => instance.queryDocuments)
            .returns((selfLink: string, query: IParameterizedQuery, callback: (error: IFeedCallbackError, resources: Array<Object>, options: IFeedCallbackOptions) => void) => {
                callback(null, [""], null);
                return true; 
            });
        const collectionObject = mock.object();
        
        // act
        getGroupedOrdersImpl(["1"], collectionObject);

        // assert
        mock.verify(instance => instance.queryDocuments, Times.Once());
    });

    it("should return a CustomersGroupedByProduct", function() {
        // arrange
        var productId = "PROD1";
        var customerId = "CUST1";
        const mock = new Mock<ICollection>()
            .setup(instance => instance.getSelfLink)
            .returns(() => { return "self-link"; })
            
            .setup(instance => instance.queryDocuments)
            .returns((selfLink: string, query: IParameterizedQuery, callback: (error: IFeedCallbackError, resources: Array<Object>, options: IFeedCallbackOptions) => void) => {
                callback(null, [customerId], null);
                return true; 
            });
        const collectionObject = mock.object();
        
        // act
        var result = getGroupedOrdersImpl([productId], collectionObject);

        // assert
        expect(result.length).toBe(1);
        expect(result[0].productId).toBe(productId);
        expect(result[0].customerIds.length).toBe(1);
        expect(result[0].customerIds[0]).toBe(customerId);
    });

    it("should throw an error when queryDocuments returns false", function() {
        // arrange;
        const mock = new Mock<ICollection>()
            .setup(instance => instance.getSelfLink)
            .returns(() => { return "self-link"; })
            
            .setup(instance => instance.queryDocuments)
            .returns((selfLink: string, query: IParameterizedQuery, callback: (error: IFeedCallbackError, resources: Array<Object>, options: IFeedCallbackOptions) => void) => {
                return false;
            });
        const collectionObject = mock.object();

        // act and assert
        expect(function() {
            getGroupedOrdersImpl(["PROD"], collectionObject) 
        }).toThrowError("Query was not accepted for product ID PROD");
    });
});
