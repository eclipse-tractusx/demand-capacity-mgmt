
/*
 *  *******************************************************************************
 *  Copyright (c) 2023 BMW AG
 *  Copyright (c) 2023 Contributors to the Eclipse Foundation
 *
 *    See the NOTICE file(s) distributed with this work for additional
 *    information regarding copyright ownership.
 *
 *    This program and the accompanying materials are made available under the
 *    terms of the Apache License, Version 2.0 which is available at
 *    https://www.apache.org/licenses/LICENSE-2.0.
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *    License for the specific language governing permissions and limitations
 *    under the License.
 *
 *    SPDX-License-Identifier: Apache-2.0
 *    ********************************************************************************
 */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import Select, { ActionMeta, OptionTypeBase } from 'react-select';
import { CompanyContext } from '../../contexts/CompanyContextProvider';
import { FavoritesContext } from '../../contexts/FavoritesContextProvider';
import CustomOption from '../../interfaces/customoption_interface';
import { CompanyDtoFavoriteResponse, FavoriteType } from '../../interfaces/favorite_interface';


interface CompanyOptionsProps {
  selectedCompanyName: string;
  onChange: (value: string) => void;
}


const CompanyOptions: React.FC<CompanyOptionsProps> = ({ selectedCompanyName, onChange }) => {
  const companiesContextData = useContext(CompanyContext);
  const { fetchFavoritesByType } = useContext(FavoritesContext)!;
  const { companies } = companiesContextData || {};

  const [companyOptions, setCompanyOptions] = useState<{ value: string; label: string; isFavorite: boolean }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchFavoritesByType(FavoriteType.COMPANY_BASE_DATA);
        const favoriteCompanyIds = new Set(response?.companies?.map((company: CompanyDtoFavoriteResponse) => company.id) || []);
        const allCompanyIds = new Set(companies?.map((company) => company.id) || []);

        // Find unique company IDs by filtering out favorites that are also in regular options
        const uniqueCompanyIds = Array.from(new Set([...favoriteCompanyIds, ...allCompanyIds]));

        const newCompanyOptions = uniqueCompanyIds.map((companyId) => {
          const company = companies?.find((c) => c.id === companyId);
          const isFavorite = favoriteCompanyIds.has(companyId);

          return {
            value: companyId,
            label: `${company?.bpn || ''} | ${company?.companyName || ''}`.trim(),
            isFavorite: isFavorite,
          };
        });

        setCompanyOptions(newCompanyOptions);
      } catch (error) {
        console.error('Error fetching company options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [companies]);

  const selectedOption = companyOptions.find((option) => option.value === selectedCompanyName) || null;

  const handleSelectChange = useCallback(
    (selectedOption: { value: string; label: string; isFavorite: boolean } | null, actionMeta: ActionMeta<OptionTypeBase>) => {
      if (actionMeta.action === 'select-option') {
        onChange(selectedOption?.value || '');
      }
    },
    [onChange]
  );

  if (loading) {
    return <div>Loading options...</div>;
  }

  return (
    <Select
      name="supplierId"
      id="supplierId"
      options={companyOptions}
      value={selectedOption}
      onChange={handleSelectChange}
      placeholder="--Choose an option--"
      noOptionsMessage={() => "No suppliers match criteria"}
      required
      isSearchable
      components={{
        Option: (props: any) => <CustomOption {...props} isFavorite={props.data.isFavorite} />,
      }}
    />
  );
};

export default CompanyOptions;
