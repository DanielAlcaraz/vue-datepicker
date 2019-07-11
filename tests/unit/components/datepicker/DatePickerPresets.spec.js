import dayjs from 'dayjs';
import { shallowMount } from '@vue/test-utils';
import DatePickerPresets from '@/components/datepicker/DatePickerPresets.vue';

describe('DatePickerPresets', () => {
  let mountComponent;

  beforeEach(() => {
    mountComponent = ({
      rangePresets,
      mutableDate,
      minDate,
      endDate,
      locale = { lang: 'en' },
    } = {}) =>
      shallowMount(DatePickerPresets, {
        propsData: {
          rangePresets,
          mutableDate,
          minDate,
          endDate,
          color: 'color',
          locale,
        },
      });
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('Should init data', () => {
    const wrapper = mountComponent();
    expect(wrapper.vm.rangePresets).toEqual(undefined);
    expect(wrapper.vm.mutableDate).toEqual(undefined);
    expect(wrapper.vm.minDate).toEqual(undefined);
    expect(wrapper.vm.endDate).toEqual(undefined);
    expect(wrapper.vm.color).toEqual('color');
    expect(wrapper.vm.locale).toEqual({ lang: 'en' });
  });

  describe('computed', () => {
    describe('presetsFormatted', () => {
      it.each([
        [{}, undefined],
        [{
          rangePresets: [{ name: 'month', dates: { start: '2018-01-01', end: '2018-01-31' } }],
          minDate: '2018-01-29',
          endDate: '2018-02-05',
        }, [{
          name: 'month',
          dates: { start: '2018-01-01', end: '2018-01-31' },
          availableDates: [dayjs('2018-01-29'), dayjs('2018-01-30'), dayjs('2018-01-31')],
        }]],
      ])(
        'when props = %p, should return %p',
        (props, expectedResult) => {
          const wrapper = mountComponent(props);
          expect(wrapper.vm.presetsFormatted).toEqual(expectedResult);
        }
      );
    });
  });

  describe('methods', () => {
    describe('isPresetSelected', () => {
      it.each([
        [{}, undefined, false],
        [
          { mutableDate: { start: '2018-01-28', end: '2018-01-31' } },
          { availableDates: [] },
          false,
        ],
        [
          { mutableDate: { start: '2018-01-28', end: '2018-01-31' } },
          { availableDates: [dayjs('2018-01-29'), dayjs('2018-01-30'), dayjs('2018-01-31')] },
          false,
        ],
        [
          { mutableDate: { start: '2018-01-29', end: '2018-01-31' } },
          { availableDates: [dayjs('2018-01-29'), dayjs('2018-01-30'), dayjs('2018-01-31')] },
          true,
        ],
      ])(
        'when props = %p, preset = %p, should return %p',
        (props, preset, expectedResult) => {
          const wrapper = mountComponent(props);
          expect(wrapper.vm.isPresetSelected(preset)).toEqual(expectedResult);
        }
      );
    });

    describe('isPresetValid', () => {
      it.each([
        [{}, undefined, false],
        [
          { mutableDate: { start: '2018-01-28', end: '2018-01-31' } },
          { availableDates: [] },
          false,
        ],
        [
          { mutableDate: { start: '2018-01-28', end: '2018-01-31' } },
          { availableDates: [dayjs('2018-01-29'), dayjs('2018-01-30'), dayjs('2018-01-31')] },
          true,
        ],
      ])(
        'when props = %p, preset = %p, should return %p',
        (props, preset, expectedResult) => {
          const wrapper = mountComponent(props);
          expect(wrapper.vm.isPresetValid(preset)).toEqual(expectedResult);
        }
      );
    });

    describe('setPresetDates', () => {
      it('Should emit first & last day from available dates', () => {
        const wrapper = mountComponent();
        const preset = { availableDates: [dayjs('2018-01-29'), dayjs('2018-01-30'), dayjs('2018-01-31')] };
        wrapper.vm.setPresetDates(preset);
        expect(wrapper.emitted().updateRange[0]).toEqual([
          { start: dayjs('2018-01-29'), end: dayjs('2018-01-31') },
        ]);
      });
    });
  });
});
