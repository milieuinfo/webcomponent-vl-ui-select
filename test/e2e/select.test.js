
const { assert, driver } = require('vl-ui-core').Test;
const VlSelectPage = require('./pages/vl-select.page');

describe('vl-select', async () => {
    const vlSelectPage = new VlSelectPage(driver);

    before(() => {
        return vlSelectPage.load();
    });

    it('ik kan de values van een select opvragen', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        const values = await select.values();
        assert.isNotEmpty(values);
        assert.isTrue(values.includes('België', 'Duitsland', 'Frankrijk'));
    });

    it('ik kan controleren of de select een bepaalde value bevat', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await assert.eventually.isTrue(select.hasValue('België'));
        await assert.eventually.isTrue(select.hasValue('Duitsland'));
        await assert.eventually.isTrue(select.hasValue('Frankrijk'));
    });

    it('ik kan een value selecteren', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await select.selectValue('Duitsland');
        const selectedValue = await select.getSelectedValue();
        assert.isTrue(selectedValue == 'Duitsland');
    });
    
    it('ik kan een select definieren als error', async () => {
        const select = await vlSelectPage.getErrorSelect();
        await assert.eventually.isTrue(select.isError());
    });
    
    it('ik kan een select definieren als success', async () => {
        const select = await vlSelectPage.getSuccessSelect();
        await assert.eventually.isTrue(select.isSuccess());
    });
    
    it('ik kan controleren of een select disabled is of niet', async () => {
        const select = await vlSelectPage.getDisabledSelect();
        await assert.eventually.isTrue(select.isDisabled());
    });
    
    it('ik kan een optie selecteren via het zoekveld', async () => {
        const select = await vlSelectPage.getSearchSelect();
        await select.search('Frankrijk');
        const selectedValue = await select.getSelectedValue();
        assert.isTrue(selectedValue == 'Frankrijk');
    });
    
    it('ik kan een waarde verwijderen uit een dropdown', async () => {
        const select = await vlSelectPage.getDeletableSelect();
        await select.selectValue('Duitsland');
        const selectedValue = await select.getSelectedValue();
        assert.isTrue(selectedValue == 'Duitsland');
        await select.deleteValue('Duitsland');
        const selectedValueAfterDelete = await select.getSelectedValue();
        assert.isTrue(selectedValueAfterDelete == '');
    });

    // it('ik kan een select dynamisch activeren', async () => {
    //     const select = await vlSelectPage.getDynamischeSelect();
    //     await assert.eventually.isFalse(select.hasValue('Label one'));
    //     await assert.eventually.isFalse(select.hasValue('Label two'));
    //     await vlSelectPage.activeerDynamischeData();
    //     const selectAfterUpdate = await vlSelectPage.getDynamischeSelect();
    //     await assert.eventually.isTrue(selectAfterUpdate.hasValue('Label one'));
    //     await assert.eventually.isTrue(selectAfterUpdate.hasValue('Label two'));
    // });

    it('ik kan een select via javascript dressen en undressen', async () => {
        const select = await vlSelectPage.getDresUndressSelect();
        await assert.eventually.isFalse(select.isDressed());
        await vlSelectPage.dress();
        await assert.eventually.isTrue(select.isDressed());
        await vlSelectPage.undress();
        await assert.eventually.isFalse(select.isDressed());
    });

    it('ik kan een select via javascript enablen en disablen', async () => {
        const select = await vlSelectPage.getEnableDisableSelect();
        await assert.eventually.isTrue(select.isEnabled());
        await vlSelectPage.disable();
        await assert.eventually.isFalse(select.isEnabled());
        await vlSelectPage.enable();
        await assert.eventually.isTrue(select.isEnabled());
    });

    it('ik kan een optie in een select kiezen en verwijderen via een knop', async () => {
        const select = await vlSelectPage.getSetMethodeSelect();
        await vlSelectPage.kies();
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
        await vlSelectPage.verwijder();
        await assert.eventually.isEmpty(select.getSelectedValue());
    })
});