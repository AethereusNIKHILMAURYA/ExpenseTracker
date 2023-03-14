public with sharing class ExpenseController {
    @AuraEnabled(cacheable=true)
   public static list<Expense__c> getExpense() {
   return[select id, Name,Expense_Date__c,Expense_Category__c,Expense_Amount__c from Expense__c];
}
@AuraEnabled
public static void deleteExpense(List<String> expenseIds) {
    List<Expense__c> RecToDelete = [SELECT Id FROM Expense__c WHERE Id IN :expenseIds];
    delete RecToDelete;
}
}
