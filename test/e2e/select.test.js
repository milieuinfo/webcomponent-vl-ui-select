
const { assert, driver } = require('vl-ui-core').Test.Setup;
const VlSelectPage = require('./pages/vl-select.page');

describe('vl-select', async () => {
    const vlSelectPage = new VlSelectPage(driver);

    before(() => {
        return vlSelectPage.load();
    });

    it('als gebruiker kan ik de values van een select opvragen', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        const values = await select.values();
        assert.isNotEmpty(values);
        assert.isTrue(values.includes('België', 'Duitsland', 'Frankrijk'));
    });

    it('als gebruiker kan ik controleren of de select een bepaalde value bevat', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await assert.eventually.isTrue(select.hasValue('België'));
        await assert.eventually.isTrue(select.hasValue('Duitsland'));
        await assert.eventually.isTrue(select.hasValue('Frankrijk'));
    });

    it('als gebruiker kan ik een value selecteren', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await select.selectByValue('Duitsland');
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
    });

    it('als gebruiker kan ik een optie selecteren via tekst', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await select.selectByText('Frankrijk');
        await assert.eventually.equal(select.getSelectedValue(), 'Frankrijk');
    });

    it('als gebruiker kan ik een optie selecteren via value', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await select.selectByValue('Duitsland');
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
    });
    
    it('als gebruiker kan ik een optie selecteren via index', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        await select.selectByIndex(2);
        await assert.eventually.equal(select.getSelectedValue(), 'Frankrijk');
    });
    
    it('als gebruiker zie ik wanneer een select een error bevat', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        const errorSelect = await vlSelectPage.getErrorSelect();
        await assert.eventually.isFalse(select.isError());
        await assert.eventually.isTrue(errorSelect.isError());
    });
    
    it('als gebruiker zie ik wanneer een select succesvol is', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        const successSelect = await vlSelectPage.getSuccessSelect();
        await assert.eventually.isFalse(select.isSuccess());
        await assert.eventually.isTrue(successSelect.isSuccess());
    });

    // TODO test dressed test

    // TODO test faalt dus probleem bij page object
    it('als gebruiker kan ik de values van een dressed select opvragen', async () => {
        const select = await vlSelectPage.getDressedSelect();
        await assert.eventually.isNotEmpty(select.values());
        await assert.eventually.includes(select.values(), 'België', 'Duitsland', 'Frankrijk');
    });

    // TODO test faalt dus probleem bij page object (in combinatie met dressed select)
    it('als gebruiker kan ik een optie selecteren via text in een dressed select', async () => {
        const select = await vlSelectPage.getDressedSelect();
        await select.selectByText('Duitsland');
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
    });

    // TODO test faalt dus probleem bij page object (in combinatie met dressed select)
    it('als gebruiker kan ik een optie selecteren via value in een dressed select', async () => {
        const select = await vlSelectPage.getDressedSelect();
        await select.selectByValue('Frankrijk');
        await assert.eventurally.equal(select.getSelectedValue(), 'Frankrijk');
    });

    // TODO test faalt dus probleem bij page object (in combinatie met dressed select)
    it('als gebruiker kan ik een optie selecteren via index in een dressed select', async () => {
        const select = await vlSelectPage.getDressedSelect();
        await select.selectByIndex(1);
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
    });

    // TODO test dressed success test

    it('als gebruiker kan ik een optie selecteren via het zoekveld', async () => {
        const select = await vlSelectPage.getSearchSelect();
        await select.search('Frankrijk');
        await select.selectByIndex(0);
        await assert.eventually.equal(select.getSelectedValue(), 'Frankrijk');
    });

    // TODO test select zonder search

    // TODO test faalt dus bug ontdekt
    it('als gebruiker zie ik wanneer een select disabled is en kan ik niets selecteren', async () => {
        const select = await vlSelectPage.getDefaultSelect();
        const disabledSelect = await vlSelectPage.getDisabledSelect();
        await assert.eventually.isFalse(select.isDisabled());
        await assert.eventually.isTrue(disabledSelect.isDisabled());
        await assert.eventually.equal(disabledSelect.getSelectedValue(), 'België');
        await disabledSelect.selectByValue('Duitsland');
        await assert.eventually.notEqual(disabledSelect.getSelectedValue(), 'Duitsland');
    });
    
    it('als gebruiker kan ik een waarde verwijderen uit een dropdown', async () => {
        const select = await vlSelectPage.getDeletableSelect();
        await select.selectByValue('Duitsland');
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
        await select.deleteSelectedValue();
        await assert.eventually.notEqual(select.getSelectedValue(), 'Duitsland');
    });

    // TODO test select met specifiek aantal resultaten

    // TODO test select met onbeperkt aantal resultaten

    it('als gebruiker kan ik een select dynamisch activeren', async () => {
        let select = await vlSelectPage.getDynamischeSelect();
        await assert.eventually.isFalse(select.isDressed());
        await assert.eventually.isFalse(select.hasValue('Label one'));
        await assert.eventually.isFalse(select.hasValue('Label two'));
        await vlSelectPage.activeerDynamischeData();
        select = await vlSelectPage.getDynamischeSelect();
        await assert.eventually.isTrue(select.isDressed());
        await assert.eventually.isNotEmpty(select.values());
        await assert.eventually.isTrue(select.hasValue('Label one'));
        await assert.eventually.isTrue(select.hasValue('Label two'));
    });

    it('als gebruiker kan ik een select via een knop dressen en undressen', async () => {
        const select = await vlSelectPage.getDresUndressSelect();
        await assert.eventually.isFalse(select.isDressed());
        await vlSelectPage.dress();
        await assert.eventually.isTrue(select.isDressed());
        await vlSelectPage.undress();
        await assert.eventually.isFalse(select.isDressed());
    });

    it('als gebruiker kan ik een select via een knop enablen en disablen', async () => {
        const select = await vlSelectPage.getEnableDisableSelect();
        await assert.eventually.isTrue(select.isEnabled());
        await vlSelectPage.disable();
        await assert.eventually.isFalse(select.isEnabled());
        await vlSelectPage.enable();
        await assert.eventually.isTrue(select.isEnabled());
    });

    it('als gebruiker kan ik een optie in een select kiezen en verwijderen via een knop', async () => {
        const select = await vlSelectPage.getSetMethodeSelect();
        await vlSelectPage.select();
        await assert.eventually.equal(select.getSelectedValue(), 'Duitsland');
        await vlSelectPage.remove();
        await assert.eventually.isEmpty(select.getSelectedValue());
     });

    after(async () => {
        return driver.quit();
    })
});
