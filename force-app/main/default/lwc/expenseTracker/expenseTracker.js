import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getExpense from '@salesforce/apex/ExpenseController.getExpense';
import deleteExpense from '@salesforce/apex/ExpenseController.deleteExpense';
import EXPENSE_OBJECT from "@salesforce/schema/Expense__c"; // import object
import AC_NAME from "@salesforce/schema/Expense__c.Name"; // import fields
import AC_DATE from "@salesforce/schema/Expense__c.Expense_Date__c"; // import fields
import AC_CURRENCY from "@salesforce/schema/Expense__c.Expense_Amount__c"; // import fields
import AC_TYPE from "@salesforce/schema/Expense__c.Expense_Category__c";//Expense Category
import expensepop from "c/expensepop";
import { refreshApex } from '@salesforce/apex';


const COLUMNS = [
    { label: 'Expense Name', fieldName: 'Name' },
    {
        label: 'Expense Amount',
        fieldName: 'Expense_Amount__c',
        cellAttribute: {
            class: { fieldName: 'amountColor' }
        }
    },
    { label: 'Expense Category', fieldName: 'Expense_Category__c' },
    { label: 'Expense Date', fieldName: 'Expense_Date__c' },
]
export default class Expensetracker extends LightningElement {

    expenseObject = EXPENSE_OBJECT;
    expenseFields = [
        AC_NAME,
        AC_DATE,
        AC_CURRENCY,
        AC_TYPE,

    ];
    @track tabledata = [];
    columns = COLUMNS
    @wire(getExpense)
    accounthandler({ data, error }) {
        if (data) {
            this.tabledata = data.map(item => {
                let amountColor = item.Expense_Amount__c < 5000 ? "slds-text-color_error" : "slds-text-color_success"
                return {...item, "amountColor": amountColor }
            })
            console.log(this.tabledata)
        }
        if (error) {
            console.log(error);
        }
    }
    handlerowselection() {
        var el = this.template.querySelector('lightning-datatable');
        var x = el.getSelectedRows();
        var y;
        for (const element of x) {
            this.id = element.Id;
            console.log('elementid', element.Id);
        }
    }
    handleDelete() {
        deleteExpense({ expenseIds: this.id })
            .then(() => {
                this.id = '';
                const toastEvent = new ShowToastEvent({
                    title: 'Record Deleted',
                    message: 'Record deleted successfully',
                    variant: 'success',
                })
                this.dispatchEvent(toastEvent);
                return refreshApex(this.data1);
            })
    }

    async showPopup() {
        const recordId = await expensepop.open({
            size: "small",
            expenseFields: this.expenseFields
        });

        if (recordId) {
            await this.showSuccessToast(recordId);
        }
    }
    async showSuccessToast(recordId) {
        const evt = new ShowToastEvent({
            title: "New Expence created",
            message: "Record ID: " + recordId,
            variant: "success"
        });
        this.dispatchEvent(evt);
    }


}
