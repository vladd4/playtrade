'use client';

import ServiceButton from '../ServiceButtons/ServiceButton';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

import styles from './Filter.module.scss';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { setShowFilter } from '@/redux/slices/filterSlice';
import { setFilteredProducts, setFiltersCount } from '@/redux/slices/filteredProducts';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';

import { NUMBER_REGEX, ProductType } from '@/utils/constants';
import { buildQueryString } from '@/utils/queryBuilder';
import { getFromSessionStorage } from '@/utils/sessionStorage_helper';

import { getFilteredProductsByGameId } from '@/http/productController';

import { jost } from '@/font';
import { game_filters } from '@/static_store/game_filters';

interface FilterProps {
  gameId: string;
  productType: ProductType;
}

interface Filters {
  platforms: string[];
  servers: string[];
  regions: string[];
}

const filtersInitialState = {
  platforms: [],
  servers: [],
  regions: [],
};

const priceInitialState = {
  from: '',
  to: '',
};

export default function FilterComponent({ gameId, productType }: FilterProps) {
  // UI State
  const [isClicked, setIsClicked] = useState<string[]>([]);
  const [isMoreClicked, setIsMoreClicked] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter State
  const [price, setPrice] = useState(priceInitialState);
  const [filters, setFilters] = useState<Filters>(filtersInitialState);

  // Hooks
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Redux State
  const { showFilter } = useAppSelector((state) => state.filter);
  const { filtersCount } = useAppSelector((state) => state.filteredProducts);

  // Static Data
  const filterOptions = JSON.parse(getFromSessionStorage('game-filters')!);

  // Memoized Values
  const hasFilters = useMemo(() => {
    return [
      searchParams.has('platforms'),
      searchParams.has('servers'),
      searchParams.has('regions'),
      searchParams.has('minPrice'),
      searchParams.has('maxPrice'),
    ].some(Boolean);
  }, [searchParams]);

  const currentFiltersAreEmpty = useMemo(() => {
    return (
      JSON.stringify(filters) === JSON.stringify(filtersInitialState) &&
      JSON.stringify(price) === JSON.stringify(priceInitialState)
    );
  }, [filters, price]);

  // Filter Logic
  const executeFilter = useCallback(
    async (filterParams: {
      platforms: string[];
      servers: string[];
      regions: string[];
      minPrice?: number;
      maxPrice?: number;
    }) => {
      if (!gameId || !productType) return;

      try {
        setLoading(true);
        const result = await getFilteredProductsByGameId({
          gameId,
          type: productType,
          ...filterParams,
        });
        dispatch(setFilteredProducts(result));
      } catch (error) {
        console.error('Filter error:', error);
      } finally {
        setLoading(false);
      }
    },
    [gameId, productType, dispatch],
  );

  // URL Sync Effect
  useEffect(() => {
    if (!hasFilters) return;

    const params = {
      platforms: searchParams.getAll('platforms'),
      servers: searchParams.getAll('servers'),
      regions: searchParams.getAll('regions'),
      minPrice: Number(searchParams.get('minPrice')) || undefined,
      maxPrice: Number(searchParams.get('maxPrice')) || undefined,
    };

    setPrice({
      from: searchParams.get('minPrice')?.trim() || '',
      to: searchParams.get('maxPrice')?.trim() || '',
    });

    setFilters({
      platforms: params.platforms,
      servers: params.servers,
      regions: params.regions,
    });

    executeFilter(params);
  }, [searchParams, hasFilters, executeFilter]);

  // Filters Count Effect
  useEffect(() => {
    if (currentFiltersAreEmpty) {
      resetState();
    }

    dispatch(
      setFiltersCount(
        filters.platforms.length +
          filters.servers.length +
          (JSON.stringify(price) !== JSON.stringify(priceInitialState) ? 1 : 0),
      ),
    );
  }, [filters, price, dispatch, currentFiltersAreEmpty]);

  // Event Handlers
  const handleFilterToggle = useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>) => (arg: string) => {
      setter((prev) =>
        prev.includes(arg) ? prev.filter((item) => item !== arg) : [...prev, arg],
      );
    },
    [],
  );

  const handleFilterClick = useCallback(
    (heading: string) => {
      handleFilterToggle(setIsClicked)(heading);
    },
    [handleFilterToggle],
  );

  const handleMoreClick = useCallback(
    (heading: string) => {
      handleFilterToggle(setIsMoreClicked)(heading);
    },
    [handleFilterToggle],
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, type: 'to' | 'from') => {
      const targetValue = e.target.value;
      if (NUMBER_REGEX.test(targetValue)) {
        setPrice((prev) => ({ ...prev, [type]: targetValue }));
      }
    },
    [],
  );

  const handleFiltersChange = useCallback(
    (value: string, type: 'platforms' | 'servers' | 'regions') => {
      setFilters((prev) => ({
        ...prev,
        [type]: prev[type].includes(value)
          ? prev[type].filter((item) => item !== value)
          : [...prev[type], value],
      }));
    },
    [],
  );

  const resetState = useCallback(() => {
    setPrice(priceInitialState);
    setFilters(filtersInitialState);

    const queryParams = buildQueryString({
      id: gameId,
      type: productType,
    });

    router.push(`${pathname}?${queryParams}`);
    dispatch(setFilteredProducts(null));
  }, [gameId, productType, router, pathname, dispatch]);

  const handleFilterProducts = useCallback(async () => {
    const queryParams = buildQueryString({
      id: gameId,
      type: productType,
      platforms: filters.platforms,
      servers: filters.servers,
      regions: filters.regions,
      minPrice: price.from || undefined,
      maxPrice: price.to || undefined,
    });

    // Update URL first - this will trigger the filter through the useEffect
    router.push(`${pathname}?${queryParams}`);
  }, [gameId, productType, filters, price, router, pathname]);

  return (
    <>
      <div
        className={`${styles.overflow} ${showFilter ? styles.show_overlay : ''}`}
        onClick={() => dispatch(setShowFilter(false))}
      />
      <article
        className={`${styles.root} ${jost.className} ${
          showFilter ? styles.show_root : ''
        }`}
      >
        <article className={styles.wrapper}>
          <X
            className={styles.close_span}
            size={26}
            onClick={() => dispatch(setShowFilter(false))}
          />
          <h1>Фільтри</h1>
          {game_filters.map((filter) => {
            return (
              <div className={styles.filter_block} key={filter.heading}>
                <div
                  className={styles.heading}
                  onClick={() => handleFilterClick(filter.heading)}
                >
                  <p>{filter.heading}</p>
                  {isClicked.includes(filter.heading) ? (
                    <ChevronUp size={19} />
                  ) : (
                    <ChevronDown size={19} />
                  )}
                </div>
                {isClicked.includes(filter.heading) &&
                  (filter.type === 'platforms' ? (
                    <div className={styles.input_block}>
                      {filterOptions &&
                        filterOptions[filter.type as 'platforms'].map(
                          (option: string) => {
                            return (
                              <div key={option} className={styles.checkbox}>
                                <input
                                  name={option}
                                  type="checkbox"
                                  value={option}
                                  checked={filters.platforms.includes(option)}
                                  onChange={() =>
                                    handleFiltersChange(option, 'platforms')
                                  }
                                />
                                <label htmlFor={option}>{option}</label>
                              </div>
                            );
                          },
                        )}
                    </div>
                  ) : (
                    <>
                      <div className={styles.input_block}>
                        {filterOptions &&
                          filterOptions[filter.type as 'regions' | 'servers']
                            .slice(0, 6)
                            .map((option: string) => {
                              return (
                                <div key={option} className={styles.checkbox}>
                                  <input
                                    name={option}
                                    type="checkbox"
                                    value={option}
                                    checked={filters.servers.includes(option)}
                                    onChange={() =>
                                      handleFiltersChange(
                                        option,
                                        filter.type as 'servers' | 'regions',
                                      )
                                    }
                                  />
                                  <label htmlFor={option}>{option}</label>
                                </div>
                              );
                            })}
                      </div>
                      <div
                        className={`${styles.hidden_input_block} ${
                          isMoreClicked.includes(filter.heading)
                            ? `${styles.show_hidden_block}`
                            : ''
                        }`}
                      >
                        {filterOptions &&
                          filterOptions[filter.type as 'regions' | 'servers']
                            .slice(6)
                            .map((option: string) => {
                              return (
                                <div key={option} className={styles.checkbox}>
                                  <input
                                    name={option}
                                    type="checkbox"
                                    value={option}
                                    checked={filters.servers.includes(option)}
                                    onChange={() =>
                                      handleFiltersChange(
                                        option,
                                        filter.type as 'servers' | 'regions',
                                      )
                                    }
                                  />
                                  <label htmlFor={option}>{option}</label>
                                </div>
                              );
                            })}
                      </div>
                      {filterOptions && filterOptions.length > 6 && (
                        <p
                          className={styles.more}
                          onClick={() => handleMoreClick(filter.heading)}
                        >
                          {isMoreClicked.includes(filter.heading)
                            ? 'Згорнути'
                            : 'Дивитись більше'}
                        </p>
                      )}
                    </>
                  ))}
              </div>
            );
          })}
          <div className={styles.price_filter}>
            <p>Ціна (UAH)</p>
            <div>
              <input value={price.from} onChange={(e) => handlePriceChange(e, 'from')} />
              <p>—</p>
              <input value={price.to} onChange={(e) => handlePriceChange(e, 'to')} />
            </div>
          </div>
          <ServiceButton
            className={`${styles.use_filters_btn} ${
              filtersCount <= 0 ? styles.disabled_btn : ''
            }`}
            isActive
            disabled={loading}
            onClick={handleFilterProducts}
          >
            {loading ? 'Завантаження...' : 'Застосувати'}
          </ServiceButton>
          <ServiceButton
            className={`${styles.reset_filters_btn} ${
              filtersCount <= 0 ? styles.disabled_btn : ''
            }`}
            onClick={resetState}
          >
            Скинути
          </ServiceButton>
        </article>
      </article>
    </>
  );
}
